import Lionet from '../dist/js/index'
//import Lionet from '../index'

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

function testSingleCoupled(step = 10, snapshot = null) {
  let coordinator = null

  if (snapshot) {

  } else {
    let root = new Lionet.Coupled('c1')
    let m1 = Lionet.Register.create('Simple', {
      name: 'm1',
      config: {
        step: 1000
      }
    })

    root.prepare({
      children: [m1],
      links: [
        {
          src: 'c1',
          srcPort: 'i_in',
          dest: 'm1',
          destPort: 'in'
        },
        {
          src: 'm1',
          srcPort: 'out',
          dest: 'c1',
          destPort: 'o_out'
        }
      ]
    })
    coordinator = new Lionet.CoupledCoordinator(root)
    coordinator.initialize()
    console.log(`init: tL: ${coordinator.tl()} tN: ${coordinator.tn()}`)
  }

  while (step > 0) {
    coordinator.simulate(1)
    step--
    let output = coordinator.output()
    if (output) {
      console.log(`output: ${JSON.stringify(output.toJson())}`)
    }
    console.log(`tL: ${coordinator.tl()} tN: ${coordinator.tn()}`)
  }

  return coordinator.snapshot()
}

function testTwoCoupled(step = 20, snapshot = null) {
  let coordinator = null

  if (snapshot) {

  } else {
    let root = new Lionet.Coupled('c1')
    let m1 = Lionet.Register.create('Simple', {
      name: 'm1',
      config: {
        step: 1000
      }
    })

    let m2 = Lionet.Register.create('Simple', {
      name: 'm2',
      config: {
        step: 500
      }
    })
    
    root.prepare({
      children: [m1, m2],
      links: [
        {
          src: 'c1',
          srcPort: 'i_in',
          dest: 'm1',
          destPort: 'in'
        },
        {
          src: 'm1',
          srcPort: 'out',
          dest: 'm2',
          destPort: 'in'
        },
        {
          src: 'm2',
          srcPort: 'out',
          dest: 'c1',
          destPort: 'o_out'
        }
      ]
    })
    coordinator = new Lionet.CoupledCoordinator(root)
    coordinator.initialize()
    console.log(`init: tL: ${coordinator.tl()} tN: ${coordinator.tn()}`)
  }

  while (step > 0) {
    coordinator.simulate(1)
    step--
    let output = coordinator.output()
    if (output) {
      console.log(`output: ${JSON.stringify(output.toJson())}`)
    }
    console.log(`tL: ${coordinator.tl()} tN: ${coordinator.tn()}`)
  }

  return coordinator.snapshot()
}

function testDeepCoupled(step = 20, snapshot = null) {
  let coordinator = null

  if (snapshot) {

  } else {
    let m1 = Lionet.Register.create('Simple', {
      name: 'm1',
      config: {
        step: 1000
      }
    })

    let m2 = Lionet.Register.create('Simple', {
      name: 'm2',
      config: {
        step: 500
      }
    })

    let c2 = new Lionet.Coupled('c2')
    c2.prepare({
      children: [m1, m2],
      links: [
        {
          src: 'c2',
          srcPort: 'i_in',
          dest: 'm1',
          destPort: 'in'
        },
        {
          src: 'm1',
          srcPort: 'out',
          dest: 'm2',
          destPort: 'in'
        },
        {
          src: 'm2',
          srcPort: 'out',
          dest: 'c2',
          destPort: 'o_out'
        }
      ]
    })
    
    let root = new Lionet.Coupled('c1')
    root.prepare({
      children: [c2],
      links: [
        {
          src: 'c1',
          srcPort: 'i_in',
          dest: 'c2',
          destPort: 'i_in'
        },
        {
          src: 'c2',
          srcPort: 'i_out',
          dest: 'c1',
          destPort: 'i_out'
        }
      ]
    })
    coordinator = new Lionet.CoupledCoordinator(root)
    coordinator.initialize()
    console.log(`init: tL: ${coordinator.tl()} tN: ${coordinator.tn()}`)
  }

  while (step > 0) {
    coordinator.simulate(1)
    step--
    let output = coordinator.output()
    if (output) {
      console.log(`output: ${JSON.stringify(output.toJson())}`)
    }
    console.log(`tL: ${coordinator.tl()} tN: ${coordinator.tn()}`)
  }

  return coordinator.snapshot()
}

let snapshot = null

 snapshot = testSingleAtomic()
 console.log(JSON.stringify(snapshot))

 snapshot = testSingleAtomic(10, snapshot)
 console.log(JSON.stringify(snapshot))

// snapshot = testSingleCoupled()
// console.log(JSON.stringify(snapshot))

//testTwoCoupled()

//snapshot = testDeepCoupled()
//console.log(JSON.stringify(snapshot))