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