import uniqid from 'uniqid'
import utils from './utils'
import logger from './logger'

/**
 * 组件模型基类
 */
 class DevsEntity {
  /**
   * 构造函数
   * @param name string 模型名
   */
  constructor(name){
    this.__class__ = this.className()
    this.__uid__ = uniqid()  // 唯一ID
    this.__name__ = '' + name  // 模型名
  }

  /**
   * 初始化辅助函数
   * @param {*} config 
   * {
   *    name: string 模型名
   * }
   */
  prepare(config) {
    if (utils.common.isString(config.name)) {
      let trim = utils.common.trimString(name)
      if (trim.length === 0) {
        logger.error(`DevsEntity::prepare failed - name is empty`)
        return 
      }
      this.__name__ = '' + config.name
    }
  }

  /**
   * 获取类名(必须手动设置，防止代码压缩后类名被修改)
   */
  className() {
    return this.__proto__.constructor.name
  }

  /**
   * 内部唯一ID
   */
  id(){
    return this.__uid__
  }

  /**
   * 实体名称
   */
  name(){
    return this.__name__
  }

  /**
   * 
   */
  toJson() {
    return {
      class: this.__class__,
      uid: this.__uid__,
      name: this.__name__
    }
  }

  /**
   * 
   * @param {*} json 
   */
  fromJson(json){
    if (!json) {
      return
    }

    if (json.class !== this.__class__) {
      logger.warn(`DevsEntity::fromJson - class <${json.class}> is invalid, should be ${this.__class__}`)
    }
    this.__uid__ = '' + json.uid
    this.__name__ = '' + json.name
  }

  /**
   * 打印输出
   */
  dump() {
    return this.toJson()
  }

}

export default DevsEntity