import { assert, expect, should } from 'chai'
import Lionet from '../index'
import Simple from './model/simple'
import Vehicle from './model/vehicle'

/**
 * 
 */
function createSingleCoupled() {
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
  let coordinator = new Lionet.CoupledCoordinator(root)
  coordinator.initialize()
  return coordinator
}

/**
 * 
 */
function createTwoCoupled() {
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
  let coordinator = new Lionet.CoupledCoordinator(root)
  coordinator.initialize()
  return coordinator
}

/**
 * 
 */
function createDeepCoupled() {
  let child
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
  let coordinator = new Lionet.CoupledCoordinator(root)
  coordinator.initialize()
  return coordinator
}

/**
 * 
 */
function createHugeCoupled() {
  let root = new Lionet.Coupled('c1')

  if (!Lionet.Register.has('Vehicle')) {
    console.log('Vehicle model is unregistered')
    return null
  }

  let children = []
  let links = []
  for(let i=0; i<50000; i++) {
    let name = `m${i}`
    let c = Lionet.Register.create('Vehicle', {
      name: name,
      config: {
        step: 1000
      }
    })

    children.push(c)
    links.push({
      src: 'c1',
      srcPort: 'i_in',
      dest: name,
      destPort: 'in'
    })
    links.push({
      src: name,
      srcPort: 'out',
      dest: 'c1',
      destPort: 'o_out'
    })
  }
  
  root.prepare({
    children: children,
    links: links
  })
  let coordinator = new Lionet.CoupledCoordinator(root)
  coordinator.initialize()
  return coordinator
}

describe('测试耦合模型', function() {
  describe('#初始化', function() {
    let model = new Lionet.Coupled('c1')
    it('name should be c1', function() {
      assert.equal('c1', model.name())
    })
    it('children.size should be 0', function() {
      assert.equal(0, model.children().size)
    })
    it('couprels.size should be 0', function() {
      assert.equal(0, model.couprels().size)
    })
  })
})

describe('测试耦合仿真器', function() {
  let coordinator = null
  describe('#单耦合仿真器', function() {
    before(function(){
      coordinator = createSingleCoupled()
    })
    it('name should be c1', function() {
      assert.equal('c1', coordinator.coupled().name())
    })
    it('children.size should be 1', function() {
      assert.equal(1, coordinator.coupled().children().size)
    })
  })

  describe('#双耦合仿真器', function() {
    before(function(){
      coordinator = createTwoCoupled()
    })
    it('name should be c1', function() {
      assert.equal('c1', coordinator.coupled().name())
    })
    it('children.size should be 1', function() {
      assert.equal(2, coordinator.coupled().children().size)
    })
  })

  describe('#多层耦合仿真器', function() {
    before(function(){
      coordinator = createDeepCoupled()
    })
    it('name should be c1', function() {
      assert.equal('c1', coordinator.coupled().name())
    })
    it('children.size should be 1', function() {
      assert.equal(1, coordinator.coupled().children().size)
    })
  })

  describe('#容量测试', function() {
    before(function(){
      coordinator = createHugeCoupled()
      assert.typeOf(coordinator, 'object')
    })
    it('name should be c1', function() {
      assert.equal('c1', coordinator.coupled().name())
    })
    it('children.size should be 1', function() {
      assert.equal(50000, coordinator.coupled().children().size)
    })
    it('running', function() {
      console.time()
      coordinator.simulate(100)
      console.timeEnd()
      assert.equal(100000, coordinator.tl())
    })
  })
})