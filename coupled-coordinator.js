import utils from './utils'
import logger from './logger'
import DevsBaseCoupledSimulator from './base-coupled-simulator'
import DevsCoordinator from './coordinator'

class DevsCoupledCoordinator extends DevsBaseCoupledSimulator{
  constructor(coupled){
    super()
    this.__coordinator__ = new DevsCoordinator(coupled)
    // 更新仿真器
    coupled.coordinator(this)
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
   * 保存当前状态
   */
  toJson() {
    return this.snapshot()
  }

   /**
   * 
   * @param {*} json 
   */
  fromJson(json){
    this.snapshot(json)
  }

  /**
   * 快照当前状态
   */
  snapshot(data) {
    if (!this.__coordinator__) {
      logger.error(`DevsCoupledCoordinator::snapshot failed - model is null`)
      return null
    }

    if (!data) {
      return Object.assign(super.snapshot(), {
        type: 'coupled-coordinator',
        coordinator: this.__coordinator__.toJson()
      })
    } else {  
      if (data.type !== 'coupled-coordinator') {
        logger.error(`DevsCoupledCoordinator::snapshot failed - data.type is invalid`)
        return
      }
      super.snapshot(data)
      this.__coordinator__.fromJson(data.coordinator)
    }
  }

}

export default DevsCoupledCoordinator