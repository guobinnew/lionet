import DevsEntity from './entity'
import utils from './utils'
import logger from './logger'

class DevsEvent extends DevsEntity {
  /**
   * 
   * @param {*} config 
   * {
   *    timestamp: number
   *    params: [object]
   * }
   */
  constructor(config){
    super(Object.assign({
      timestamp: 0
    }, config))
  }

  /**
   * 获取/设置时间戳
   * @param {*} ts number
   */
  timestamp(ts){
    if (!ts) {
      return this.__timestamp__
    }

    if (!utils.common.isNumber(ts)) {
      logger.error(`DevsEvent::timestamp failed - ts is not number : ${ts}`)
      return
    }

    this.__timestamp__ = ts
  }

  /**
   * 设置参数
   * @param {*} name string
   * @param {*} value any
   */
  setParam(name, value){
    let handle = utils.common.hashString(name)
    if(!handle){
      logger.error(`DevsEvent::addParam failed - name is invalid : ${name}`)
      return
    }

    // 提醒重复项，覆盖旧值
    if (this.__params__.has(handle)) {
      logger.warn(`DevsEvent::addParam failed - name is repeated : ${name}`)
    }

    this.__params__.set(handle, {name: name, value: value})
  }

  /**
   * 获取参数
   * @param name string | handle 参数名或句柄
   * @return object 参数值 
   */
  getParam(name){
    let handle = name 
    if (utils.common.isString(name)){
      handle = utils.common.hashString(name)
    }

    if(!utils.common.isNumber(handle)){
      logger.error(`DevsEvent::getParam failed - name is invalid : ${name}`)
      return null
    }

    return this.__params__.get(handle)
  }

  /**
   * 
   * @param {*} name   string | number
   */
  hasParam(name){
    let handle = name 
    if (utils.common.isString(name)){
      handle = utils.common.hashString(name)
    }

    if(!utils.common.isNumber(handle)){
      logger.error(`DevsEvent::hasParam failed - name is invalid : ${name}`)
      return false
    }

    return this.__params__.has(handle)
  }

  /**
   * 删除参数
   * @param {*} name string | number
   */
  deleteParam(name){
    let handle = name 
    if (utils.common.isString(name)){
      handle = utils.common.hashString(name)
    }

    if(!utils.common.isNumber(handle)){
      logger.error(`DevsEvent::deleteParam failed - name is invalid : ${name}`)
      return false
    }

    return this.__params__.delete(handle)
  }

  /**
   * 清空参数
   */
  clear(){
    this.__params__.clear()
  }

  /**
   * 获取参数列表
   * @return [object] 参数列表
   */
  params(){
    let params = []
    for(let p of this.__params__.values()){
      params.push(p)
    }
    return params
  }

  /**
   * 
   */
  toJson() {
    return Object.assign(super.toJson(),
    {
      timestamp: this.__timestamp__,
      params: utils.common.clone(this.params())
    })
  }

  /**
   * 
   * @param {*} json 
   */
  fromJson(json){
    super.fromJson(json)
    this.__timestamp__ = json.timestamp

    if (this.__params__) {
      this.__params__.clear()
    } else {
      this.__params__ = new Map()
    }

    // 添加参数
    if (utils.common.isArray(json.params)){
      for(let p of json.params){
        this.setParam(p.name, p.value)
      }  
    }
 
  }
}

export default DevsEvent