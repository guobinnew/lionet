import DevsEntity from './entity'
import DevsEvent from './event'
import utils from './utils'
import logger from './logger'

/**
 * 
 */
class DevsMessage extends DevsEntity {
  /**
   * 
   * @param {*} config 
   * {
   *    contents: [object]
   * }
   */
  constructor(config){
    super(config)
  }

  /**
   * 
   * @param {*} content 
   */
  addContent(content){
    if (utils.common.isNull(content)){
      logger.error(`DevsMessage::addContent failed - content is null`)
      return
    }
    this.__contents__.push(content)
  }

  /**
   * 设置参数
   * @param {*} port string
   * @param {*} event any
   */
  setContent(port, event){
    if (!utils.common.isString(port)){
      logger.error(`DevsMessage::setContent failed - port is not a string : ${port}`)
      return
    }

    let handle = utils.common.hashString(port)
    if (!handle) {
      logger.error(`DevsMessage::setContent failed - port is invalid : ${port}`)
      return
    }

    if (!event){
      logger.error(`DevsMessage::setContent failed - event is null : ${event}`)
      return
    }

    // 允许同名事件多次出现
    this.__contents__.push({
      port: port,
      event: event
    })
  }

  /**
   * 
   */
  contentCount(){
    return this.__contents__.length
  }
 
  /**
   * 获取事件
   * @param i number 索引
   * @return DevsEvent
   */
  getContent(i){
    return this.__contents__[i]
  }

  /**
   * 按类型获取事件
   * @param {*} port
   * @retrun [DevsEvent] | null
   */
  getContents(port){
    if (!utils.common.isString(port)){
      logger.error(`DevsMessage::getContents failed - port is not a string : ${port}`)
      return null
    }

    let list = new Array()
    for(let content of this.__contents__){
      if (content.port === port) {
        list.push(content.event)
      }
    }

    return list
  }

  /**
   * 
   * @param {*} name string
   */
  hasContents(port){
    if (!utils.common.isString(port)){
      logger.error(`DevsMessage::hasContents failed - port is not a string : ${port}`)
      return false
    }

    let found = false
    for(let content of this.__contents__){
      if (content.port === port) {
        found = true
        break
      }
    }
    return found
  }

  /**
   * 
   * @param {*} i number
   */
  deleteContent(i){
    if (i>=0 && i<this.__contents__.length){
      this.__contents__.splice(i,1)
    } else {
      logger.warn(`DevsMessage::deleteContent failed - i is invalid : ${i}`)
    }
  }

  /**
   * 删除参数
   * @param {*} name string 
   */
  deleteContents(port){
    if (!utils.common.isString(port)){
      logger.error(`DevsMessage::deleteContents failed - port is not a string : ${port}`)
      return
    }

    let newlist = new Array()
    for(let content of this.__contents__){
      if (content.port !== port) {
        newlist.push(content)
      }
    }
    this.__contents__ = newlist
  }

  /**
   * 
   */
  empty(){
    return this.__contents__.length === 0
  }

  /**
   * 设置消息时戳
   * @param {*} ts 
   */
  setTimestamp(ts){
    if (!utils.common.isNumber(ts)){
      logger.error(`DevsMessage::setTimestamp failed - ts is not a number : ${ts}`)
      return
    }

    for(let content of this.__contents__){
      content.event.timestamp(ts)
    }
  }

  /**
   * 合并消息
   * @param {*} msg 
   */
   merge(msg){
     if (!msg){
       return 
     } 
     if(!(msg instanceof DevsMessage)){
      logger.error(`DevsMessage::merge failed - msg is not a DevsMessage : ${msg}`)
      return
     }
     for(let content of msg.contents()){
       this.__contents__.push(content)
     }
   }

  /**
   * 清空参数
   */
  clear(){
    this.__contents__.splice(0, this.__contents__.length)
  }

  /**
   * 获取参数列表
   * @return [object] 参数列表
   */
  contents(){
    return this.__contents__
  }

  /**
   * 
   */
  toJson() {
    let contents = new Array()
    for(let content of this.__contents__){
      contents.push({
        port: content.port,
        event: content.event.toJson()
      })
    }

    return Object.assign(super.toJson(),
    {
      contents: contents
    })
  }

  /**
   * 
   * @param {*} json 
   */
  fromJson(json){
    super.fromJson(json)

    if (this.__contents__){
      this.__contents__.splice(0, this.__contents__.length)
    } else {
      this.__contents__ = new Array()
    }

    // 添加参数
    if (utils.common.isArray(json.contents)){
      for(let p of json.contents){
        let evt = new DevsEvent(p.event)
        this.setContent(p.port, evt)
      }  
    }
  }
}

export default DevsMessage