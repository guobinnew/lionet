import DevsEntity from './entity'
import logger from './logger'
import utils from './utils'

/**
 * 组件模型对象
 */
class DevsModel extends DevsEntity {
  /**
   * 构造函数
   * @param {*} name string
   */
  constructor(name){
    super(name)
    this.__inports__ = new Set()
    this.__outports__ = new Set()
    this.__portHandles__ = new Map()
  }

  /**
   * 初始化
   * @param {*} config 
   * {
   *    继承 DevsEntity
   *    ports: [
   *      {
   *        orientation: in | out  端口类型
   *        name: string 端口名
   *      }
   *    ]
   * }
   */
  prepare(config) {
    super.prepare(config)
    // 添加端口
    if (utils.common.isArray(config.ports)) {
      this.__inports__.clear()
      this.__outports__.clear()
      this.__portHandles__.clear()

      for(let p of config.ports){
        p.orientation === 'in' ? this.addInport(p.name) : this.addOutport(p.name)
      }
    }
  }

  /**
   * 添加输入端口
   * @param {*} name string 端口名 不能为空（在一个模型中必须唯一）
   * @return number 端口句柄 0表示无效
   */
  addInport(name){
    let handle = utils.common.hashString(name)
    if (!handle) {
      logger.error(`DevsModel::addInport failed - invalid param`)
      return 0
    }

    if (this.__portHandles__.has(handle)){
      logger.warn(`DevsModel::addInport - port <${name}> is already existed`)
      return handle
    }
    this.__inports__.add(handle)
    this.__portHandles__.set(handle, name)
    return handle
  }

  /**
   * 添加输出端口
   * @param {*} name string 端口名 不能为空（在一个模型中必须唯一）
   * @return number 端口句柄 0表示无效
   */
  addOutport(name){
    let handle = utils.common.hashString(name)
    if (!handle) {
      logger.error(`DevsModel::addOutport failed - invalid param`)
      return 0
    }

    if (this.__portHandles__.has(handle)){
      logger.warn(`DevsModel::addOutport - port <${name}> is already existed`)
      return handle
    }
    this.__outports__.add(handle)
    this.__portHandles__.set(handle, name)
    return handle
  }

  /**
   * 根据端口句柄获取端口名
   * @param handle number 大于0的整数
   * @return string 
   */
  portName(handle){
    if (!utils.common.isNumber(handle) || handle <= 0){
      logger.error(`DevsModel::portName failed - handle <${handle}> is invalid`)
      return null
    }

    if(!this.__portHandles__.has(handle)){
      return null
    }
    return this.__portHandles__.get(handle)
  }

  /**
   * 根据端口名获取句柄
   * @param {*} name 
   * @return number | null
   */
  portHandle(name){
    if (!utils.common.isString(name)){
      logger.warn(`DevsModel::portHandle failed - name <${name}> is invalid`)
      return null
    }

    let handle = null
    for(let [key, value] of this.__portHandles__.entries()){
      if (value === name) {
        handle = key
        break
      }
    }
    return handle
  }

  /**
   * 判断是否端口已经存在
   * @param {*} handle number
   * @return bool
   */
  hasPort(handle){
    if (!utils.common.isNumber(handle) || handle <= 0){
      logger.error(`DevsModel::hasPort failed - handle <${handle}> is invalid`)
      return false
    }

    return this.__portHandles__.has(handle)
  }

  /**
   * 获取所有输入端口名
   * @return [string]
   */
  inportNames(){
    let names = new Array()
    for (let handle of this.__inports__) {
      names.push(this.portName(handle))
    }
    return names
  }

   /**
   * 获取所有输出端口名
   * @return [string]
   */
  outportNames(){
    let names = new Array()
    for (let handle of this.__outports__) {
      names.push(this.portName(handle))
    }
    return names
  }

  /**
   * 打印输出
   */
  dump() {
    let ports = new Array()
    for (let handle of this.__inports__) {
      ports.push({
        orientation: 'in',
        name: this.portName(handle)
      })
    }
    for (let handle of this.__outports__) {
      ports.push({
        orientation: 'out',
        name: this.portName(handle)
      })
    }
    return Object.assign(super.dump(),
    {
      ports: ports
    })
  }
}

export default DevsModel