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
    if(!(child instanceof DevsModel)) {
      logger.error(`DevsCoupled::add failed - child is not a DevsModel`)
      return
    }
    let key = child.name()
    if (this.__children__.has(key)){
      logger.warn(`DevsCoupled::add - found duplicated name: ${key}`)
    }
    this.__children__.set(key, child)
  }

  /**
   * 子模型集合
   * @return Map
   */
  children(){
    return this.__children__
  }


  /**
   * 模型端口连接集合
   * @return Map
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

    this.__coordinator__ = coord
  }

  /**
   * 根据名称获取子模型
   * @param {*} name string
   * @return DevsModel 可能是自己
   */
  child(name){
    if(!utils.common.isString(name)){
      logger.error(`DevsCoupled::child failed - name is not a string`)
      return null
    }

    // 可能是自己
    if(name === this.name()){
      return this
    }

    return this.__children__.get(name)
  }

  /**
   * 添加事件通讯
   * @param {*} src object
   * {
   *    model: DevsModel | string
   *    port: string 端口名
   * }
   * @param {*} dest 
   */
  addCouprel(src, dest){
    if (!src  || !dest ) {
      return
    }

    let srcModel = src.model
    if(!(srcModel instanceof DevsModel)){
      srcModel = this.child(src.model)
    }

    if (!srcModel){
      logger.error(`DevsCoupled::addCouprel failed - src is invalid`)
      return
    }

    let destModel = dest.model
    if(!(destModel instanceof DevsModel)){
      destModel = this.child(dest.model)
    }

    if (!destModel){
      logger.error(`DevsCoupled::addCouprel failed - dest is invalid`)
      return
    }

    if (srcModel === this){
      srcModel.addInport(src.port)  // 内部联系
    } else {
      srcModel.addOutport(src.port)
    }

    if (destModel === this){
      destModel.addOutport(dest.port)  // 内部联系
    } else {
      destModel.addInport(dest.port)
    }

    // 检测是否已经存在(不能重复添加)
    let couprel = {
      srcModel: srcModel,
      srcPort: src.port,
      destModel: destModel,
      destPort: dest.port
    }
    let handle = this.couprelHandle(couprel)
    if (!this.__couprels__.has(handle)){
      this.__couprels__.set(handle, couprel)
    } else {
      logger.warn(`DevsCoupled::addCouprel failed - found duplicated couprel: ${src} ${dest}`)
      return
    }
  }

  couprelHandle(couprel){
    if (!couprel || !couprel.srcModel || !couprel.destModel) {
      logger.error(`DevsCoupled::couprelHandle failed - couprel is invalid`)
      return null
    }

    return utils.common.hashString(
      couprel.srcModel.id() + ':' + couprel.srcPort + '>' + couprel.destModel.id() + ':' + couprel.destPort
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
    for(let child of this.__children__.values()){
      child.initialize()
    }
  }

  /**
   * 
   */
  toJson() {
    let children = new Array()
    for(let child of this.__children__.values()){
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

export default DevsCoupled