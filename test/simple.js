import Lionet from '../dist/js/index'

class Simple extends  Lionet.Atomic {
  constructor(config){
    super(config)
    this.__step__ = config.step
    this.__msgid__ = 0
  }

  // 初始化（由仿真器调用）
	initialize(){
    this.addInport('in')
    this.addOutport('out')
    this.holdIn(Lionet.Utils.devs.state.Passive, this.__step__)
  }

	// 外部变迁（delta为相对时间）
	deltext(delta, msg){
    if (msg) {
      for(let content of msg.contents()){
        if (content.port === 'in') {
          console.log('receiving event: ' + content.event.toJson())
        }
      }
    }
    this.resume(delta)
  }

	// 内部状态变迁（仅发生在tN时刻）
	deltint(){
    this.holdIn(Lionet.Utils.devs.state.Passive, this.__step__)
  }

	// 输出（仅发生在tN时刻）
	output(){
    let msg = new Lionet.Message()
    let evt = new Lionet.Event()
    evt.setParam('Number', this.__msgid__++)
    msg.setContent('out', evt)
    return msg
  }
}

Lionet.Register.register('Simple', Simple)

function testSingleAtomic(step = 10){
  let root = new Simple({
    name: 'm1',
    step: 1000
  })

  let simulator = new Lionet.AtomicSimulator(root)
  simulator.initialize()
  console.log(`init: tL: ${simulator.tl()} tN: ${simulator.tn()}`)
	while( step>0 ){
	 simulator.simulate(1)
   step--
   let output = simulator.output()
   if (output) {
    console.log(`output: ${JSON.stringify(output.toJson())}`)
   }
	 console.log(`tL: ${simulator.tl()} tN: ${simulator.tn()}`)
	}
}

function testSingleCoupled(step = 10){
  let root = new Lionet.Coupled({name: 'c1'})
  let m1 = new Simple({
    name: 'm1',
    step: 1000
  })

  root.add(m1)
  root.addCouprel({
    model: 'c1',
    port: 'i_in',
  },
  {
    model: 'm1',
    port: 'in'
  })

  root.addCouprel({
    model: 'm1',
    port: 'out',
  },
  {
    model: 'c1',
    port: 'o_out'
  })

  let coordinator = new Lionet.CoupledCoordinator(root)
  coordinator.initialize()
  console.log(`init: tL: ${coordinator.tl()} tN: ${coordinator.tn()}`)
	while( step>0 ){
    coordinator.simulate(1)
   step--
   let output = coordinator.output()
   if (output) {
    console.log(`output: ${JSON.stringify(output.toJson())}`)
   }
	 console.log(`tL: ${coordinator.tl()} tN: ${coordinator.tn()}`)
	} 
}


//testSingleAtomic()
testSingleCoupled()
