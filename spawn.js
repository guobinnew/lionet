import utils from './utils'
import logger from './logger'
import DevsModelRegister from './registry'
import DevsAtomicSimulator from './atomic-simulator'

const DevsSpawn = {
  spawn: function(option){
    if (!option) {
      logger.error(`DevsSpawn::spawn failed - option is null`)
      return null
    }

    if (!option.model) {
      logger.error(`DevsSpawn::spawn failed - model is null`)
      return null
    }

    let root = DevsModelRegister.create(option.model.__class__)
    root.snapshot(option.model)

    // 原子仿真器
    let simulator = null
    if (option.type === 'atomic') {
      simulator = new DevsAtomicSimulator(root)

    } else if (option.type === 'coupled') {
      
    }
    simulator.fromJson(option.simulator)
   
    return simulator
  }
}

export default DevsSpawn
