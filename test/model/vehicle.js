import Lionet from '../../index'

class Vehicle extends Lionet.Atomic {
  constructor(name, config) {
    super(name)
    if (config) {
      this.__step__ = +config.step
    } else {
      this.__step__ = 1000
    }

    this.x = 0
    this.y = 0
    this.speed = Math.random() * 10

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
    let angle = Math.random()
    this.x += this.__step__ * this.speed * angle
    this.y += this.__step__ * this.speed * (1 - angle)
    this.holdIn(Lionet.Utils.devs.state.Passive, this.__step__)
  }

  // 输出（仅发生在tN时刻）
  output() {
    let msg = new Lionet.Message()
    let evt = new Lionet.Event()
    evt.setParam('x', this.x)
    evt.setParam('y', this.y)
    msg.setContent('out', evt)
    return msg
  }

  // 打印输出
  print() {
    return{
      step: this.__step__,
      x: this.x,
      y: this.y,
      speed: this.speed
    }
  }

  // 保存/加载快照
  clone(data) {
    if (!data) {
      return this.print()
    } else {
      this.__step__ = +data.step
      this.x = +data.x
      this.y = +data.y
      this.speed = +data.speed
    }
  }
}

/**
 * 必须定义类标示
 */
Vehicle.prototype.__classId__ = 'Vehicle'
Lionet.Register.register(Vehicle)

export default Vehicle
