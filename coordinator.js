import utils from './utils'
import logger from './logger'
import version from './verison'
import DevsMessage from './message'
import DevsAtomic from './atomic'
import DevsCoupled from './coupled'
import DevsCoupledSimulator from './coupled-simulator'
import DevsCoupledCoordinator from './coupled-coordinator'

/**
 * 	耦合模型仿真器（用于顶层耦合模型的运行）
 *  考虑支持克隆，暂时不允许用户继承自定义协调器
 */
class DevsCoordinator {
  /**
   * 
   * @param {*} config 
   * {
   *    timestamp: number
   *    params: [object]
   * }
   */
  constructor(coupled){
    this.__coupled__ = coupled
    this.__coupled__.coordinator(this)

    this.__couprels__ = new Set()
    this.__simulators__ = new Set()
    this.__tl__ = utils.devs.time.Initial
    this.__tn__ = utils.devs.time.Infinity
    this.__input__ = null
    this.__output__ = new DevsMessage()

    this.setSimulators()
    this.informCoupling()
  }

  /**
   * 
   */
  tl(){
    return this.__tl__
  }
  
  /**
   * 
   */
  tn(){
    return this.__tn__
  }

  /**
   * 
   * @param {*} startTime 
   */
  initialize(startTime = utils.devs.time.Initial){
    for(let sim of this.__simulators__){
      sim.initialize(startTime)
    }
    this.__tl__ = startTime
    this.__tn__ = this.nextTN()
  }

  /**
   * 
   * @param {*} loop 
   */
  simulate(loop){
    for(let i=0; i<loop; i++){
      if (this.__tl__ >= utils.devs.time.Infinity) {
        break
      }

      this.computeInputOutput(this.__tn__)
      this.wrapDeltafunc(this.__tn__)
      this.__tl__ = this.__tn__
      this.__tn__ = this.nextTN()
    }
  }

  /**
   * 
   * @param {*} timestamp 
   * @param {*} msg 
   */
  simInject(timestamp, msg){
    //  如果时戳小于tN则处理，否则不予处理
    if (timestamp <= this.nextTN()){
      this.__input__ = msg
      this.wrapDeltafunc(timestamp)
      this.__tl__ = timestamp
      this.__tn__ = this.nextTN()
    }
  }

  /**
   * 
   * @param {*} curTime 
   */
  computeInputOutput(curTime){
      this.__output__.clear()

    // 遍历执行输入输出
    for(let sim of this.__simulators__){
      sim.computeInputOutput(curTime)
    }

    // 遍历发送消息
    for(let sim of this.__simulators__){
      sim.sendMessages()
    }
  }

  /**
   * 
   * @param {*} curTime 
   */
  wrapDeltafunc(curTime){
    this.sendDownMessages()

    // 执行时间推进
    for(let sim of this.__simulators__){
      sim.deltaFunc(curTime)
    }

    if (this.__input__){
      this.__input__.clear()
    }
  }

  /**
   * 
   */
  nextTN(){
    let tn = utils.devs.time.Infinity
    for(let sim of this.__simulators__) {
      let next = sim.nextTN()
      if (next < tn) {
        tn = next
      }
    }
    return tn
  }

  /**
   * 
   */
  output(){
    return this.__output__
  }

  /**
   * 是否有外部信息
   */
  hasInjectMessage(){
    return this.__input__ && !this.__input__.empty()
  }
  
  /**
   * 插入输入事件
   * @param {*} msg 
   */
  injectMessage(msg){
    if (!this.__input__) {
      this.__input__ = new DevsMessage()
    }
    this.__input__.merge(msg)
  }

  /**
   * 
   * @param {*} contents 
   */
  putMessageEvent(content) {
    content.event.timestamp(this.tn())
    this.__output__.addContent(content)
  }

  /**
   * 协调器对应的耦合模型
   */
  coupled(){
    return this.__coupled__
  }

  informCoupling(){
    for(let rel of this.__coupled__.couprels().values()) {
      // 如果连接源模型为耦合模型自身，则为外部关联（外部输入）
      if (rel.src === this.__coupled__) {
        this.addCouprel(rel)
      } else {
        if ( rel.src instanceof DevsAtomic) {
          rel.src.simulator().addCouprel(rel)
        } else if ( rel.src instanceof DevsCoupled) {
          rel.src.coordinator().addCouprel(rel)
        }
      }
    }
  }

  /**
   * 根据耦合模型组成配置仿真器
   */
  setSimulators(){
    for(let child of this.__coupled__.children().values()) {
      if ( child instanceof DevsAtomic) {
        this.addSimulator(child)
      } else if ( child instanceof DevsCoupled) {
        this.addCoordinator(child)
      }
    }
  }

  /**
   * 
   * @param {*} atomic 
   */
  addSimulator(atomic){
    let sim = new DevsCoupledSimulator(atomic)
    sim.parent(this)
    this.__simulators__.add(sim)
  }

  /**
   * 
   * @param {*} coupled 
   */
  addCoordinator(coupled){
    let coor = new DevsCoupledCoordinator(coupled)
    coor.parent(this)
    this.__simulators__.add(coor)
  }

  /**
   * 向内部传递消息
   */
  sendDownMessages(){
    if (this.__input__ && !this.__input__.empty()){
      let receiver = this.convertInput(this.__input__)
      for(let ri of receiver){
        if (ri.model instanceof DevsAtomic){
          ri.model.simulator().putMessageEvent(content)
        } else if (ri.model instanceof DevsCoupled){
          ri.model.coordinator().putMessageEvent(content)
        }
      }
    }
  }

  /**
   * 转换输入消息
   * @param {*} msg 
   * @return [object]
   * {
   *   model: DevsModel,
   *   port: 端口名
   *   event: 事件
   * }
   */
  convertInput(msg){
    let receiver = new Array()
    if (msg) {
      for(let content of msg.contents()){
        // 将外部输入消息转换为内部子模型的输入消息
        for(let rel of this.__couprels__){
          if (rel.srcPort === content.port){
            receiver.push({
              model: rel.dest,
              content:{
                port: rel.destPort,
                event: content.event
              }
            })
          }
        }
      }
    }
    return receiver
  }

  /**
   * 添加外部链接
   * @param {*} rel 
   */
  addCouprel(rel){
    if (!rel) {
      logger.error(`DevsCoordinator::addCouprel failed - rel is null`)
      return
    }
    this.__couprels__.add(rel)
  }

   /**
   * 快照当前状态
   */
  snapshot(data) {
    if (!this.__coupled__) {
      logger.error(`DevsCoordinator::snapshot failed - model is null`)
      return null
    }

    if(!data) {
      return {
        type: 'coordinator',
        version: version.current,
        model: this.__coupled__.snapshot()
      }
    } else {
      this.__coupled__.snapshot(data.model)
    }
  }

  /**
   * 保存当前状态
   */
  toJson() {
    let json = {
      tl: this.__tl__,
      tn: this.__tn__,
    }

    if (this.__input__) {
      json.input = this.__input__.toJson()
    }

    if (this.__output__) {
      json.output = this.__output__.toJson()
    }
    return json
  }

  /**
   * 
   * @param {*} json 
   */
  fromJson(json){
    if (!json) {
      logger.error(`DevsCoordinator::fromJson failed - json is null`)
      return null
    }

    if (!utils.common.isNumber(json.tl)) {
      logger.warn(`DevsCoordinator::fromJson - tl is not a number`)
      this.__tl__ = utils.devs.time.Initial
    } else {
      this.__tl__ = json.tl
    }

    if (!utils.common.isNumber(json.tn)) {
      logger.warn(`DevsCoordinator::fromJson - tn is not a number`)
      this.__tn__ = utils.devs.time.Infinity
    } else {
      this.__tn__ = json.tn
    }

    if (json.input) {
      this.__input__ = new DevsMessage()
      this.__input__.fromJson(json.input)
    } else {
      this.__input__ = null
    }

    if (json.output) {
      this.__output__.fromJson(json.output)
    }

  }
}

export default DevsCoordinator