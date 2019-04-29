//import Lionet from '../dist/js/index'

import Lionet from '../index'
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

    /**
   * 获取类名(必须手动设置，防止代码压缩后类名被修改)
   */
  className() {
    return 'Simple' //this.__proto__.constructor.name
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
          console.log('receiving event: ' + content.event.toJson())
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
  dump() {
    return Object.assign(super.dump(),
    {
      custom: {
        step: this.__step__,
        msgid: this.__msgid__ 
      }
    })
  }

  // 保存/加载快照
  snapshot(data) {
    if (!data) {
      return Object.assign(super.snapshot(),
      {
        step: this.__step__,
        msgid: this.__msgid__ 
      })
    } else {
      super.snapshot(data)
      this.__step__ = +data.step
      this.__msgid__ = +data.msgid
    }
  }

}

Lionet.Register.register(Simple)

/**
 * 
 * @param {*} step 推进步数
 * @param {*} snapshot 快照
 */
function testSingleAtomic(step = 10, snapshot = null) {
  let simulator = null

  if (snapshot) {
    simulator = Lionet.Spawn.spawn(snapshot)
    if (!simulator) {
      console.log(`spawn failed: ${JSON.stringify(snapshot)}`)
      return
    }
  } else {
    let root = Lionet.Register.create('Simple', {
      name: 'm1',
      config: {
        step: 1000
      }
    })

    simulator = new Lionet.AtomicSimulator(root)
    simulator.initialize()
    console.log(`init: tL: ${simulator.tl()} tN: ${simulator.tn()}`)
  }

  while (step > 0) {
    simulator.simulate(1)
    step--
    let output = simulator.output()
    if (output) {
      console.log(`output: ${JSON.stringify(output.toJson())}`)
    }
    console.log(`tL: ${simulator.tl()} tN: ${simulator.tn()}`)
  }

  // snapshot
  return simulator.snapshot()
}

function testSingleCoupled(step = 10) {
  let root = new Lionet.Coupled({
    name: 'c1'
  })
  let m1 = new Simple({
    name: 'm1',
    step: 1000
  })

  root.add(m1)
  root.addCouprel({
    model: 'c1',
    port: 'i_in',
  }, {
    model: 'm1',
    port: 'in'
  })

  root.addCouprel({
    model: 'm1',
    port: 'out',
  }, {
    model: 'c1',
    port: 'o_out'
  })

  let coordinator = new Lionet.CoupledCoordinator(root)
  coordinator.initialize()
  console.log(`init: tL: ${coordinator.tl()} tN: ${coordinator.tn()}`)
  while (step > 0) {
    coordinator.simulate(1)
    step--
    let output = coordinator.output()
    if (output) {
      console.log(`output: ${JSON.stringify(output.toJson())}`)
    }
    console.log(`tL: ${coordinator.tl()} tN: ${coordinator.tn()}`)
  }
}


let snapshot = testSingleAtomic()
console.log(JSON.stringify(snapshot))

snapshot = testSingleAtomic(10, snapshot)
console.log(JSON.stringify(snapshot))

//testSingleCoupled()
