import utils from './utils'
import logger from './logger'
import DevsMessage from './message'
import DevsAtomic from './atomic'
import DevsCoupled from './coupled'
import DevsCoordinator from './coordinator'

/**
 *   复合组件仿真器基类
 */
class DevsBaseCoupledSimulator {
  constructor() {
    this.__parent__ = null
    this.__couprels_ = new Set()
    this.__input__ = new DevsMessage()
  }

  /**
   * 添加模型连接信息
   * @param {*} rel 
   */
  addCouprel(rel) {
    if (!rel) {
      logger.error(`DevsBaseCoupledSimulator::addCouprel failed - rel is null`)
      return
    }
    this.__couprels_.add(rel)
  }

  /**
   * 添加消息事件
   * @param {*} contens 
   */
  putMessageEvent(content) {
    this.__input__.addContent(content)
  }

  /**
   * 
   * @param {*} parent 
   */
  parent(parent) {
    if (utils.common.isNull(parent)) {
      return this.__parent__
    }

    if (!parent instanceof DevsCoordinator) {
      logger.error(`DevsBaseCoupledSimulator::parent failed - parent is not DevsCoordinator`)
      return
    }
    this.__parent__ = parent
  }

  /**
   * 
   * @param {*} msg 
   */
  convertMessage(msg) {
    let receiver = new Array()
    for (let content of msg.contents()) {
      let found = false
      for (let rel of this.__couprels_) {
        // 如果连接的输出为消息内容的发出端口（即输出端口）, 将消息内容的端口替换为接受模型的输入端口
        if (content.port === rel.srcPort) {
          receiver.push({
            model: rel.dest,
            content: {
              port: rel.destPort,
              event: content.event
            }
          })
          found = true
        }
      }

      if (!found) {
        logger.warn(`DevsBaseCoupledSimulator::convertMessage - port <${content.port}> is discarded`)
      }
    }


    return receiver
  }

  sendMessages() {
    let msg = this.output()
    if (msg) {
      if (!(msg instanceof DevsMessage)) {
        logger.error(`DevsBaseCoupledSimulator::sendMessages failed - msg is not a DevsMessage`)
        return
      }

      let receiver = this.convertMessage(msg)
      for (let ri of receiver) {
        // 如果目的模型为父耦合模型，则添加到父模型的输出消息，消息时间一律改为接受者的tN
        if (ri.model == this.__parent__.coupled()) {
          this.__parent__.putMessageEvent(ri.content)
        }
        // 如果目的模型为其他内部原子子模型，则添加到其输入消息，消息时间一律改为父模型的tN
        else if (ri.model instanceof DevsAtomic) {
          // 消息内容的时戳设置为父协调器的下一次仿真时间
          ri.model.simulator().putMessageEvent(ri.content)
        }
        // 如果目的模型为其他内部耦合子模型，则添加到其输入消息，消息时间一律改为父模型的tN
        else if (ri.model instanceof DevsCoupled) {
          ri.model.coordinator().putMessageEvent(ri.content)
        }
      }
    }
  }

  /**
   * 接口函数
   */
  tl() {
    return utils.devs.time.Initial
  }

  tn() {
    return utils.devs.time.Infinity
  }

  output() {
    return null
  }

  modelName() {
    return ''
  }

  initialize(startTime) {}
  deltaFunc(curTime) {}
  computeInputOutput(curTime) {}

  nextTN() {
    return utils.devs.time.Infinity
  }

   /**
   * 快照当前状态
   */
  snapshot(data) {
    if (!data) {
      let json = {}
      if (this.__input__) {
        json.input = this.__input__.toJson()
      }
      return json
    } else {
      if (data.input) {
        this.__input__.fromJson(data.input)
      }
    }
  }
}

export default DevsBaseCoupledSimulator