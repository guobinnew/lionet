import { assert, expect, should } from 'chai'
import Lionet from '../index'
import Simple from './model/simple'

/**
 * 
 */
function createSingleAtomic(name, step = 1000) {
  let root = Lionet.Register.create('Simple', {
    name: name,
    config: {
      step: step
    }
  })
  simulator = new Lionet.AtomicSimulator(root)
  simulator.initialize()
  return simulator
}

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
    simulator = createSingleAtomic('m1')
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


describe('Atomic Simulation', function() {
  describe('#single model', function() {
      it('should return -1 when the value is not present', function() {
        let simulator = createSingleAtomic('m1')
        console.log(`init: tL: ${simulator.tl()} tN: ${simulator.tn()}`)

        let snapshot = testSingleAtomic(1)
        console.log(JSON.stringify(snapshot))
        assert.equal(-1, snapshot))
      })
  })
})


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
    coordinator = Lionet.Spawn.spawn(snapshot)
    if (!coordinator) {
      console.log(`spawn failed: ${JSON.stringify(snapshot)}`)
      return
    }
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
          srcPort: 'o_out',
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

let snapshot = null

//  snapshot = testSingleAtomic()
//  console.log(JSON.stringify(snapshot))

//  snapshot = testSingleAtomic(10, snapshot)
//  console.log(JSON.stringify(snapshot))

// snapshot = testSingleCoupled()
// console.log(JSON.stringify(snapshot))

//testTwoCoupled()

snapshot = testDeepCoupled()
console.log(JSON.stringify(snapshot))

snapshot = testDeepCoupled(20, snapshot)
console.log(JSON.stringify(snapshot))


