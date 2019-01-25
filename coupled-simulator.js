import utils from './utils'
import logger from './logger'
import DevsBaseCoupledSimulator from './base-coupled-simulator'
import DevsAtomicSimulator from './atomic-simulator'

class DevsCoupledSimulator extends DevsBaseCoupledSimulator{
  constructor(atomic){
    super()
    this.__simulator__ =  new DevsAtomicSimulator(atomic)
  }

  tl(){
    return this.__simulator__.tl()
  }

  tn(){
    return this.__simulator__.tn()
  }

  modelName(){
    return this.__simulator__.owner().name()
  }

  initialize(startTime){
    this.__simulator__.initialize(startTime)
  }

  output(){
    return this.__simulator__.output()
  }

  deltaFunc(curTime){
    // 原子仿真器处理输入消息（一次性处理所有content）
    this.__simulator__.simInject(curTime, this.__input__)
    this.__input__.clear()
  }

  computeInputOutput(curTime){
    this.__simulator__.computeInputOutput(curTime)
  }

  nextTN(){
    return this.__simulator__.nextTN()
  }
}

export default DevsCoupledSimulator