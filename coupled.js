import DevsModel from './model'
import utils from './utils'
import logger from './logger'

class DevsCoupled extends DevsModel {
   /**
   * 构造函数
   * @param {*} config 
   *  {
   *     继承 DevsModel
   *     children: [object]  子模型列表
   *  }
   */
  constructor(config){
    super(config)
    this.__coordinator__ = null
  }

  /**
   * 添加子模型
   * @param {*} child 
   */
  add(child){
    if(!child || !child.isDevsModel) {
      logger.error(`DevsCoupled::add failed - child is not a DevsModel`)
      return
    }
    this.__children__.add(child)
  }

  /**
   * 子模型集合
   * @return Set
   */
  children(){
    return this.__children__
  }


  /**
   * 模型端口连接集合
   * @return Set
   */
  couprels(){
    return this.__couprels__
  }

    /**
   * 获取/设置协调器
   * @param {*} coord 
   */
  coordinator(coord){
    if (!coord) {
      return this.__coordinator__
    }

    if (!utils.common.isObject(coord)) {
      logger.error(`DevsCoupled::coordinator failed - invalid param ${coord}`)
      return
    }

    if (!coord.isDevsCoordinator) {
      logger.error(`DevsCoupled::coordinator failed - coord is not a DevsCoordinator`)
      return
    }
    this.__coordinator__ = coord
  }

  /**
   * 添加事件通讯
   * @param {*} src object
   * {
   *    model: DevsModel
   *    port: string 端口名
   * }
   * @param {*} dest 
   */
  addCouprel(src, dest){
    if (!src  || !dest ) {
      return
    }

    let srcPortHandle = 0
    let destPortHandle = 0
    if (src.model === this){
      srcPortHandle = src.model.addInport(src.port)  // 内部联系
    } else {
      srcPortHandle = src.model.addOutport(src.port)
    }

    if (dest.model === this){
      destPortHandle = dest.model.addOutport(dest.port)  // 内部联系
    } else {
      destPortHandle = dest.model.addInport(dest.port)
    }

    // 检测是否已经存在(不能重复添加)
    let couprel = {
      src: src.model,
      srcPortHandle: srcPortHandle,
      dest: dest.model,
      destPortHandle: destPortHandle
    }
    let handle = this.couprelHandle(couprel)
    if (!this.__couprels__.has(handle)){
      this.__couprels__.set(handle, couprel)
    } else {
      logger.warn(`DevsCoupled::coordinator failed - coord is not a DevsCoordinator`)
      return
    }
  }

  couprelHandle(couprel){
    if (!couprel || !couprel.src || !couprel.dest) {
      logger.error(`DevsCoupled::addCouprel failed - couprel is repeated : ${src} ${dest}`)
      return null
    }

    return utils.common.hashString(
      couprel.src.name() + ':' + couprel.src.portName(couprel.srcPortHandle) + '>' + couprel.dest.name() + ':' + couprel.dest.portName(couprel.destPortHandle)
    )
  }

  /**
   * 
   */
  hasCouprel(couprel){
    if (!couprel) {
      logger.error(`DevsCoupled::hasCouprel failed - couprel is null`)
      return false
    }

    let handle = this.couprelHandle(couprel)
    return this.__couprels__.has(handle)
  }

  /**
   * Override
   */
  initialize(){
    for(let child of this.__children__){
      child.initialize()
    }
  }

  /**
   * 
   */
  toJson() {
    let children = new Array()
    for(let child of this.__children__){
      children.push(child.toJson())
    }

    let couprels = new Array()
    for(let rel of this.__couprels__.values()){
      couprels.push({
        src: rel.src.name(),
        srcPort: rel.src.portName(rel.srcPortHandle),
        dest: rel.dest.name(),
        destPort: rel.dest.portName(rel.destPortHandle)
      })
    }

    return Object.assign(super.toJson(),
    {
      children: children,
      couprels: couprels
    })
  }

  /**
   * 
   * @param {*} json 
   */
  fromJson(json){
    super.fromJson(json)
    
    if (this.__children__) {
      this.__children__.clear()
    } else {
      this.__children__ = new Map()
    }

    if (this.__couprels__) {
      this.__couprels__.clear()
    } else {
      this.__couprels__ = new Map()
    }
   
    // 添加子模型
    if (utils.common.isArray(json.children)){
      for(let p of json.children){
        
      }  
    }

    // 添加连接
    if (utils.common.isArray(json.couprels)){
      for(let p of json.couprels){
        
      }
    }
  }

}