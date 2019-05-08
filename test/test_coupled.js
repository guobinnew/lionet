import { assert, expect, should } from 'chai'
import Lionet from '../index'
import Simple from './model/simple'

/**
 * 
 */
function createSimpleCoupled(name) {
  let root = new Lionet.Coupled(name)
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

describe('测试简单耦合仿真器', function() {
  let coordinator = null
  before(function(){
    coordinator = createSimpleCoupled('c1')
  })
})