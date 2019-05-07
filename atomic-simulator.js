import uniqid from 'uniqid'
import utils from './utils'
import version from './verison'
import logger from './logger'
import DevsMessage from './message';

/**
 * 组件模型基类
 */
class DevsAtomicSimulator {
  constructor(atomic) {
    this.__uid__ = uniqid()
    this.__tl__ = utils.devs.time.Initial
    this.__tn__ = utils.devs.time.Infinity
    this.__output__ = null
    this.__owner__ = atomic
    this.__owner__.simulator(this)
  }

  tl() {
    return this.__tl__
  }

  tn() {
    return this.__tn__
  }

  owner() {
    return this.__owner__
  }

  output() {
    return this.__output__
  }

  nextTN() {
    return this.__tn__
  }

  /**
   * 
   * @param {*} timestamp 
   * @param {*} msg 
   */
  simInject(timestamp, msg) {
    // 如果输入激励的时间小于下一次仿真时间
    if (timestamp <= this.nextTN()) {
      this.wrapDeltafunc(timestamp, msg)
    }
  }

  /**
   * 初始化
   * @param {*} startTime 起始⌚️，默认为0
   */
  initialize(startTime = utils.devs.time.Initial) {
    if (!this.__owner__) {
      logger.error(`DevsAtomicSimulator::initialize failed - model is null`)
    } else {
      this.__owner__.initialize()
    }
    this.__tl__ = startTime
    this.__tn__ = utils.devs.time.Infinity
    this.__output__ = null
    this.updateTN(this.__owner__.ta())
  }

  /**
   * 仿真推进
   * @param {*} loop  为仿真循环次数
   */
  simulate(loop) {
    if (!this.__owner__) {
      logger.error(`DevsAtomicSimulator::simulate failed - model is null`)
      return
    }
    // 当下一次仿真时间不是无穷大，且仿真循环次数不够则进行仿真计算
    for (let i = 0; i < loop; i++) {
      this.computeInputOutput(this.__tn__)
      this.wrapDeltafunc(this.__tn__, null)
    }
  }

  computeInputOutput(curTime) {
    if (this.equalTN(curTime)) {
      this.__output__ = this.__owner__.output()
      this.__output__.setTimestamp(curTime)
    } else {
      this.__output__ = null
    }
  }

  /**
   * 
   * @param {*} curTime 
   * @param {*} msg 
   */
  wrapDeltafunc(curTime, msg) {
    // 如果外部消息为空，当前时间不等于tN，则不进行处理，也不更新当前时间
    if (!msg) {
      if (!this.equalTN(curTime)) {
        return
      } else {
        // 内部变迁处理
        this.__owner__.deltint()
      }
    } else {
      if (!this.equalTN(curTime)) {
        // 外部变迁处理
        this.__owner__.deltext(curTime - this.__tl__, msg)
      } else {
        // 进行冲突处理
        this.__owner__.deltcon(curTime - this.__tl__, msg)
      }
    }

    // 重新计算仿真时间
    this.__tl__ = curTime;
    this.updateTN(this.__owner__.ta())
  }

  /**
   * 是否相等（绝对时间）
   * @param {*} curTime 
   */
  equalTN(curTime) {
    return curTime === this.__tn__
  }

  /**
   * 更新下一次仿真时间（相对时间）
   * @param {*} delta number
   */
  updateTN(delta) {
    if (delta === utils.devs.time.Infinity || this.__tl__ === utils.devs.time.Infinity) {
      this.__tn__ = utils.devs.time.Infinity
    } else {
      this.__tn__ = this.__tl__ + delta
    }
  }

  /**
   * 快照当前状态
   */
  snapshot(data) {
    if (!this.__owner__) {
      logger.error(`DevsAtomicSimulator::snapshot failed - model is null`)
      return null
    }
    if (!data) {
      return {
        type: 'simulator',
        version: version.current,
        model: this.__owner__.snapshot()
      }
    } else {
      this.__owner__.snapshot(data.model)
    }
  }

  /**
   * 保存当前状态
   */
  toJson() {
    let json = {
      tl: this.__tl__,
      tn: this.__tn__
    }
    if (this.__output__) {
      json.output = this.__output__.toJson()
    }
    return json
  }

  /**
   * 恢复当前状态
   */
  fromJson(json) {
    if (!json) {
      logger.error(`DevsAtomicSimulator::fromJson failed - json is null`)
      return null
    }

    if (!utils.common.isNumber(json.tl)) {
      logger.warn(`DevsAtomicSimulator::fromJson - tl is not a number`)
      this.__tl__ = utils.devs.time.Initial
    } else {
      this.__tl__ = json.tl
    }

    if (!utils.common.isNumber(json.tn)) {
      logger.warn(`DevsAtomicSimulator::fromJson - tn is not a number`)
      this.__tn__ = utils.devs.time.Infinity
    } else {
      this.__tn__ = json.tn
    }

    if (json.output) {
      this.__output__ = new DevsMessage()
      this.__output__.fromJson(json.output)
    } else {
      this.__output__ = null
    }
  }

}

export default DevsAtomicSimulator