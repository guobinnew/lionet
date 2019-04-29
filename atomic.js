import DevsModel from './model'
import utils from './utils'
import logger from './logger'

class DevsAtomic extends DevsModel{
  /**
   * 构造函数
   */
  constructor(name){
    super(name)
    this.__simulator__ = null // 模型执行器
    this.__sigma__ = 0 // 当前状态的剩余时间（相对时间）
    this.__phase__ = 0 // 当前状态句柄
    this.__stateHandles__ = new Map()
   
    // 注册保留状态
    this.__reservedHandles__ = new Array()
    for(let [k,v] of Object.entries(utils.devs.state)) {
      this.registerState({name: `__${k}__`, value: v, reserved: true})
    }
  }

  /**
   * 
   * @param {*} config
   * {
   *   states: [string] 状态列表
   * }
   */
  prepare(config) {
    super.prepare(config)

    if (utils.common.isArray(config.states)) {
      this.__stateHandles__.clear()

      for(let s of config.states){
        if (utils.common.isString(s)){
          this.registerState({name: s})
        } else {
          logger.error(`DevsAtomic::prepare failed - state <${s}> is invalid`)
        }
      }
    }
  }


  /**
   * 注册状态
   * @param {*} option 
   * {
   *    name string 状态名
   *    value: number 状态句柄
   *    reserved: bool 是否为保留状态
   * }
   */
  registerState(option){
    if (!utils.common.isObject(option) || !utils.common.isString(option.name)){
      logger.error(`DevsAtomic::registerState failed - invalid param`)
      return 
    }

    let n = utils.common.trimString(option.name)
    if (n.length === 0){
      logger.error(`DevsAtomic::registerState failed - name is empty`)
      return 
    }

    // 检测是否与保留状态冲突
    if (!option.reserved && this.__reservedHandles__.indexOf(n) >= 0) {
      logger.error(`DevsAtomic::registerState failed - name <${n}> is reserved state`)
      return 
    }

    let h = option.value
    if (utils.common.isNull(h)){
      h = utils.common.hashString(n)
    } else if (!utils.common.isNumber(h)){
      logger.error(`DevsAtomic::registerState failed - handle <${h}> is not number`)
      return
    }

    // 检测是否重复
    if(this.__stateHandles__.has(h)) {
      logger.warn(`DevsAtomic::registerState failed - handle <${h}> is repeated`)
      return
    }

    if (option.reserved) {
      this.__reservedHandles__.push(option.name)
    }

    this.__stateHandles__.set(h, n)
  }

  /**
   * 下一次推进时间（相对当前时刻的时间）
   * @return number 
   */
  ta(){
    return this.__sigma__
  }

  /**
   * 当前状态
   * @return number
   */
  phase(){
    return this.__phase__
  }

  /**
   * 获取/设置当前状态的sigma
   * @delta number 
   * @return number
   */
  sigma(delta){
    if (!delta) {
      return this.__sigma__
    }

    if (!utils.common.isNumber(delta)) {
      logger.error(`DevsAtomic::sigma failed - delta <${delta}> is not number`)
      return
    }

    this.__sigma__ = delta
  }

  /**
   * 获取/设置仿真器
   * @param {*} sim DevsAtomicSimulator | DevsCoupledSimulator
   */
  simulator(sim){
    if (!sim) {
      return this.__simulator__
    }

    if (!utils.common.isObject(sim)) {
      logger.error(`DevsAtomic::simulator failed - invalid param : ${sim}`)
      return
    }

    this.__simulator__ = sim
  }

  /**
   * 初始化（由仿真器调用）
   * @param {*} json 
   */
  initialize(json){
    if (json) {
      this.fromJson(json)
    } else {
      this.__sigma__ = 0
      this.__phase__ = 0
    }
  }

  /**
   * 外部变迁（delta为相对时间）
   * @delta number 相对前一次仿真时刻的时间
   * @msg object 外部事件
   */
  deltext(delta, msg){
  }

  /**
   * 内部状态变迁（仅发生在tN时刻）
   */
  deltint(){
  }

  /**
   * 输出（仅发生在tN时刻）
   */
  output(){
    return null
  }

  /**
   * 冲突事件处理（如果内部变迁和外部变迁同时发生则使用该函数）
   * @delta number 相对前一次仿真时刻的时间
   * @msg object 外部事件
   */
  deltcon(delta, msg){
    this.deltint()
    this.deltext(0, msg)
  }

  /**
   * 保持状态
   * @param delta number
   */
  resume(delta){
    // 如果不是永久保持，则更新Sigma
    if (this.__sigma__ < utils.devs.time.Infinity){
      let sigma = this.__sigma__ - delta
      if (sigma < 0) {
        logger.warn(`DevsAtomic::resume - sigma < 0`)
      }
      this.sigma(sigma)
    }
  }

  /**
   * 保持新状态
   * @param {*} state string | number 状态名或句柄
   * @param {*} delta number 保持时间
   */
  holdIn(state, delta){
    if (!utils.common.isString(state) && !utils.common.isNumber(state)){
      logger.error(`DevsAtomic::holdIn failed - state <${state}> is invalid`)
      return false
    }

    let handle = state
    if (utils.common.isString(handle)){
      handle = this.phaseHandle(handle)
    }

    if(utils.common.isNull(handle)) {
      logger.error(`DevsAtomic::holdIn failed - state <${state}> can not found`)
      return
    }

    this.__phase__ = handle
    this.sigma(delta)
  }

  /**
   * 永久停留在指定状态
   * @param {*} state  string | number 状态名或句柄
   */
  passivateIn(state){
    this.holdIn(state, utils.devs.time.Infinity)
  }


  /**
   * 永久停留保留空闲状态
   */
  passivated(){
    this.holdIn(utils.devs.state['Passive'], utils.devs.time.Infinity)
  }

  /**
   * 检查当前状态
   * @param {*} state  string | number 状态名或句柄
   * @return boolean
   */
  phaseIs(state){
    if (!utils.common.isString(state) && !utils.common.isNumber(state)){
      logger.error(`DevsAtomic::phaseIs failed - state <${state}> is invalid`)
      return false
    }
    
    let h = state
    if (utils.common.isString(h)){
      h = this.phaseHandle(h)
    }
    
    if (!utils.common.isNumber(h)){
      return false
    }

    return this.__phase__ === h
  }

  phaseName(handle){
    if (!utils.common.isNumber(handle)){
      logger.error(`DevsAtomic::phaseName failed - handle <${handle}> is invalid`)
      return null
    }

    if(this.__portHandles__.has(handle)){
      return null
    }
    return this.__portHandles__.get(handle)
  }

  /**
   * 获取状态句柄
   * @param {*} name 
   * @return number | null
   */
  phaseHandle(name){
    if (!utils.common.isString(name)){
      logger.error(`DevsAtomic::phaseHandle failed - name <${name}> is invalid`)
      return null
    }
    let handle = null
    for(let [key, value] of this.__stateHandles__.entries()){
      if (value === name) {
        handle = key
        break
      }
    }
    return handle
  }

  /**
   * 打印输出
   */
  dump() {
    let states = new Array()
    for(let [key, value] of this.__stateHandles__.entries()){
      states.push({
        name: value,
        value: key
      })
    }
    return Object.assign(super.dump(),
    {
      class: this.__class__,
      states: states,
      current: {
        phase: this.phaseName(this.__phase__),
        sigma: this.__sigma__
      }
    })
  }

  /**
   * 
   */
  toJson() {
    return Object.assign(super.toJson(),
    {
      sigma: this.__sigma__,
      phase: this.__phase__ 
    })
  }

  /**
   * 
   * @param {*} json 
   */
  fromJson(json){
    super.fromJson(json)
    this.__sigma__ = +json.sigma
    this.__phase__ = +json.phase
  }

  /**
   * 
   * @param {*} data 
   */
  snapshot(data) {
    if (!data) {
      return {
        __class__: this.className(),
        __base__: this.toJson()
      }
    } else {
      this.fromJson(data['__base__'])
    }
  }

}

export default DevsAtomic