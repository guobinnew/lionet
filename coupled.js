import DevsModel from './model'
import utils from './utils'
import logger from './logger'

/**
 * 目前不允许用户派生
 */
class DevsCoupled extends DevsModel {
   /**
   * 构造函数
   * @param {*} config 
   *  {
   *     继承 DevsModel
   *     children: [object]  子模型列表
   *  }
   */
  constructor(name){
    super(name)
    this.__coordinator__ = null
    this.__children__ = new Map()
    this.__couprels__ = new Map()
  }

  /**
   * 
   * @param {*} config
   * {
   *   links: []
   * }
   */
  prepare(config) {
    if (!config) {
      return
    }
    super.prepare(config)

    this.__children__.clear()
    if (utils.common.isArray(config.children)) {
      for( let c of config.children) {
        this.add(c)
      }
    }

    this.__couprels__.clear()
    if (utils.common.isArray(config.links)) {
      for( let l of config.links) {
        this.addCouprel(l)
      }
    }

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
   *    model: string
   *    port: string 端口名
   * }
   * @param {*} dest 
   */
  addCouprel(couprel){
    if (!couprel) {
      return
    }

    let c = Object.assign({}, couprel)

    c.src = this.child(c.src)
    if (!c.src){
      logger.error(`DevsCoupled::addCouprel failed - src <${couprel.src}> is invalid`)
      return
    }

    c.dest = this.child(couprel.dest)
    if (!c.dest){
      logger.error(`DevsCoupled::addCouprel failed - dest <${couprel.dest}> is invalid`)
      return
    }

    // 耦合模型动态添加端口
    if (c.src === this){
      this.addInport(couprel.srcPort)  // 内部联系
    } 
    if (c.dest === this){
      this.addOutport(couprel.destPort)  // 内部联系
    } 

    // 检测是否已经存在(不能重复添加)
    let handle = this.couprelHandle(c)
    if (!this.__couprels__.has(handle)){
      this.__couprels__.set(handle, c)
    } else {
      logger.warn(`DevsCoupled::addCouprel failed - found duplicated couprel: ${couprel}`)
      return
    }
  }

  couprelHandle(couprel){
    if (!couprel || !couprel.src || !couprel.dest) {
      logger.error(`DevsCoupled::couprelHandle failed - couprel is invalid`)
      return null
    }

    return utils.common.hashString(
      couprel.src.id() + ':' + couprel.srcPort + '>' + couprel.dest.id() + ':' + couprel.destPort
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
   * 获取连接信息
   */
  getLinks() {
    let links = new Array()
    for(let rel of this.__couprels__.values()){
      links.push({
        src: rel.src.name(),
        srcPort: rel.srcPort,
        dest: rel.dest.name(),
        destPort: rel.destPort
      })
    }
    return links
  }

  /**
   * 打印输出
   */
  dump() {
    let children = new Array()
    for(let child of this.__children__.values()){
      children.push(child.dump())
    }

    return Object.assign(super.dump(),
    {
      type: 'coupled',
      class: this.__proto__.__classId__,
      children: children,
      links: this.getLinks()
    })
  }

  /**
   * 
   */
  toJson() {
    return Object.assign(super.toJson(),
    {
      type: 'coupled',
      class: this.__proto__.__classId__,
    })
  }

  /**
   * 
   * @param {*} json 
   */
  fromJson(json){
    if (json.type !== 'coupled') {
      logger.error(`DevsCoupled::fromJson failed - json.type is not coupled`)
      return
    }

    if (json.class !== this.__proto__.__classId__) {
      logger.error(`DevsCoupled::fromJson failed - json.class is invalid, expectd to be ${this.__proto__.__classId__}`)
      return
    }
    super.fromJson(json)
  }

  /**
   * 耦合模型
   * @param {*} data 
   */
  snapshot(data) {
    if (!data) {
      let json = this.toJson()

      json.children = new Array()
      for(let child of this.__children__.values()){
        json.children.push(child.snapshot())
      }
      json.links = this.getLinks()

      if (this.__coordinator__) {
        json.coordinator =  this.__coordinator__.toJson()
      }
      return json
    } else {
      this.fromJson(data)
      if (this.__coordinator__) {
        this.__coordinator__.fromJson(data.coordinator)
      }

      // 递归子模型状态更新
      if (utils.common.isArray(data.children)) {
        for(let c of data.children){
          let child = this.__children__.get(c.name)
          if (!child) {
            logger.error(`DevsCoupled::fromJson failed - model <${c.name}> is not existed`)
            continue
          }
          child.snapshot(c)
        }
      } else {
        logger.warn(`DevsCoupled::fromJson - json.children is not array`)
      }
    }
  }
}

DevsCoupled.prototype.__classId__ = 'DevsCoupled'

export default DevsCoupled