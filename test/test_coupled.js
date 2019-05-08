import { assert, expect, should } from 'chai'
import Lionet from '../index'
import Simple from './model/simple'

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
  coordinator = new Lionet.CoupledCoordinator(root)
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
  coordinator = new Lionet.CoupledCoordinator(root)
  coordinator.initialize()
  return coordinator
}

/**
 * 
 */
function createDeepCoupled() {
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

describe('测试单耦合仿真器', function() {
  let coordinator = null
  describe('测试单耦合仿真器', function() {
    before(function(){
      coordinator = createSingleCoupled()
    })
  })
})