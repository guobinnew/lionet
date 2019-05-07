import utils from './utils'
import logger from './logger'
import DevsModelRegister from './registry'
import DevsAtomicSimulator from './atomic-simulator'
import DevsCoordinator from './coordinator'

const spawnAtomic = function(option) { 
  if (!option.model) {
    logger.error(`DevsSpawn::spawn failed - model is null`)
    return null
  }

  let root = DevsModelRegister.create(option.model.class)
  // 原子仿真器
  let simulator = new DevsAtomicSimulator(root)
  simulator.snapshot(option)

  return simulator
}

/**
 * 根据定义创建耦合模型
 * @param {Object} model 
 */
const spawnCoupledModel = function(model) {

}

const spawnCoupled = function(option) { 
  if (!option.model) {
    logger.error(`DevsSpawn::spawn failed - option.model is null`)
    return null
  }

  let root = __spawnCoupledModel(option.model)
  // 耦合仿真器
  let coordinator = new DevsCoordinator(root)
  coordinator.shapshot(option)
 
  return coordinator
}

const DevsSpawn = {
  spawn: function(option){
    if (!option) {
      logger.error(`DevsSpawn::spawn failed - option is null`)
      return null
    }

    if (option.type === 'atomic') {
      return spawnAtomic(option)
    } else if (option.type === 'coupled') {
      return spawnCoupled(option)
    }
    return null
  },
  spawnCoupledModel: spawnCoupledModel
}

export default DevsSpawn
