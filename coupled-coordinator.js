import utils from './utils'
import logger from './logger'
import DevsBaseCoupledSimulator from './base-coupled-simulator'
import DevsCoordinator from './coordinator'

class DevsCoupledCoordinator extends DevsBaseCoupledSimulator{
  constructor(coupled){
    super()
    this.__coordinator__ = new DevsCoordinator(coupled)
  }

  tl(){
    return this.__coordinator__.tl()
  }

  tn(){
    return this.__coordinator__.tn()
  }

  modelName(){
    return this.__coordinator__.coupled().name()
  }

  initialize(startTime){
    this.__coordinator__.initialize(startTime)
  }

  output(){
    return this.__coordinator__.output()
  }

  deltaFunc(curTime){
    this.__coordinator__.simInject(curTime, this.__input__)
    this.__input__.clear()
  }

  computeInputOutput(curTime){
    this.__coordinator__.computeInputOutput(curTime)
  }

  nextTN(){
    return this.__coordinator__.nextTN()
  }

  /**
   * 快照当前状态
   */
  snapshot() {
    return {
      type: 'coupled-coordinator',
      coordinator: this.__coordinator__.snapshot()
    }
  }

}

export default DevsCoupledCoordinator