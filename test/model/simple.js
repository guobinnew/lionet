import Lionet from '../../index'

class Simple extends Lionet.Atomic {
  constructor(name, config) {
    super(name)
    if (config) {
      this.__msgid__ = config.msgid ? +config.msgid : 0
      this.__step__ = +config.step
    } else {
      this.__msgid__ =  0
      this.__step__ = 1000
    }

    this.prepare({
      ports: [
        { name: 'in', orientation: 'in'},
        { name: 'out', orientation: 'out'}
      ]
    })
  }

  // 初始化（由仿真器调用）
  initialize(json) {
    super.initialize(json)
    if (json) {

    } else {
      this.holdIn(Lionet.Utils.devs.state.Passive, this.__step__)
    }
  }

  // 外部变迁（delta为相对时间）
  deltext(delta, msg) {
    if (msg) {
      for (let content of msg.contents()) {
        if (content.port === 'in') {
          console.log('receiving event: ' + JSON.stringify(content.event.toJson()))
        }
      }
    }
    this.resume(delta)
  }

  // 内部状态变迁（仅发生在tN时刻）
  deltint() {
    this.holdIn(Lionet.Utils.devs.state.Passive, this.__step__)
  }

  // 输出（仅发生在tN时刻）
  output() {
    let msg = new Lionet.Message()
    let evt = new Lionet.Event()
    evt.setParam('Number', this.__msgid__++)
    msg.setContent('out', evt)
    return msg
  }

  // 打印输出
  print() {
    return{
      step: this.__step__,
      msgid: this.__msgid__ 
    }
  }

  // 保存/加载快照
  clone(data) {
    if (!data) {
      return this.print()
    } else {
      this.__step__ = +data.step
      this.__msgid__ = +data.msgid
    }
  }
}

/**
 * 必须定义类标示
 */
Simple.prototype.__classId__ = 'Simple'
Lionet.Register.register(Simple)

export default Simple
