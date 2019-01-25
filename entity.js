import uniqid from 'uniqid'

/**
 * 组件模型基类
 */
 class DevsEntity {
  /**
   * 构造函数
   * @param config
   * {
   *    uid: string 唯一ID，如果没有则自动生成
   *    name: string 模型名（必须唯一）
   * }
   */
  constructor(config){
    this.fromJson(Object.assign({
      uid: uniqid(),
      name: ''
    }, config))
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
    this.__uid__ = json.uid
    this.__name__ = json.name
  }

}

export default DevsEntity