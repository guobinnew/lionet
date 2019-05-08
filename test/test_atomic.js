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
  let simulator = new Lionet.AtomicSimulator(root)
  simulator.initialize()
  return simulator
}

describe('测试原子模型', function() {
  describe('#初始化', function() {
      let model = new Simple('m1')
      model.initialize()
      it('name should be m1', function() {
        assert.equal('m1', model.name())
      })
      it('step should be 1000', function() {
        assert.equal(1000, model.__step__)
      })
      it('msgid should be 0', function() {
        assert.equal(0, model.__msgid__)
      })
  })
})

describe('测试原子仿真器', function() {
  let simulator = null
  before(function(){
    simulator = createSingleAtomic('m1')
  })

  describe('#初始化', function() {
    it('tl should be 0', function() {
      assert.equal(0, simulator.tl())
    })
    it('tn should be 1000', function() {
      assert.equal(1000, simulator.tn())
    })
  })
  describe('#单步推进', function() {
    before(function(){
      simulator.simulate(1)
    })
    it('tl should be 1000', function() {
      assert.equal(1000, simulator.tl())
    })
    it('tn should be 2000', function() {
      assert.equal(2000, simulator.tn())
    })
  })
  describe('#连续推进', function() {
    before(function(){
      simulator.simulate(9)
    })
    it('tl should be 10000', function() {
      assert.equal(10000, simulator.tl())
    })
    it('tn should be 11000', function() {
      assert.equal(11000, simulator.tn())
    })
  })
  describe('#生成快照', function() {
    let snapshot = null
    let expected = { 
      type: 'simulator',
      version: 1,
      model:{
        name: 'm1',
        type: 'atomic',
        class: 'Simple',
        sigma: 1000,
        phase: 0,
        custom: { step: 1000, msgid: 10 },
        simulator: { 
          tl: 10000, 
          tn: 11000,
          output:  {
            "contents": [
            {
              "event": {
                "name": "Event",
                "params": [
                  {"name": "Number", "value": 9}
                ],
                "timestamp": 10000
              },
              "port": "out"
            }
            ],
            "name": "Message"
          } 
        } 
      } 
    }
    before(function(){
      snapshot = simulator.snapshot()
      delete snapshot.model['uid']
      const simu = snapshot.model.simulator
      delete simu['uid']
      delete simu.output['uid']
      for(let e of simu.output.contents) {
        delete e.event['uid']
      }
    })
    it('snapshot should be a object', function() {
      expect(snapshot).to.be.an('object')
      assert.equal('simulator', snapshot.type)
      assert.equal(1, snapshot.version)
      assert.equal(1, snapshot.version)
    })
    it('snapshot.simulator should be a object', function() {
      const simu = snapshot.model.simulator
      expect(simu).to.be.an('object')
      expect(simu).to.deep.equal(expected.model.simulator)
    })
    it('snapshot.model should be a object', function() {
      const model = snapshot.model
      expect(model).to.be.an('object')
      expect(model).to.deep.equal(expected.model)
    })
    describe('#使用快速重建模型', function() {
      let clone = null
      before(function(){
        snapshot = simulator.snapshot()
        clone = Lionet.Spawn.spawn(snapshot)
      })
      it('tl should be 10000', function() {
        assert.equal(10000, clone.tl())
      })
      it('tn should be 11000', function() {
        assert.equal(11000, clone.tn())
      })
    })
  })
})
