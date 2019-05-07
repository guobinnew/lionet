import utils from './utils'
import logger from './logger'
import version from './verison'
import DevsModelRegister from './registry'
import DevsAtomicSimulator from './atomic-simulator'
import DevsCoordinator from './coordinator'

/**
 * 根据定义创建耦合模型
 * @param {Object} model 
 */
const spawnModel = function(model) {
  if (!model) {
    logger.error(`DevsSpawn::spawnModel failed - model is null`)
    return null
  }

  if (!model.type) {
    logger.error(`DevsSpawn::spawnModel failed - model.type is null`)
    return null
  }

  let root = null
  let option = {
    name: model.name
  }
  if (model.type  === 'atomic') {
    root = DevsModelRegister.create(model.class, option)
  } else if (model.type  === 'coupled') {
    // 强制采用DevsCoupled
    root = DevsModelRegister.create('DevsCoupled', option)
    const def = {
      children: [],
      links: model.links
    }
    // 创建孩子节点
    if (model.children) {
      for(let c of model.children) {
        let child = spawnModel(c)
        if (!child) {
          logger.error(`DevsSpawn::spawnModel failed - model is invalid, ${c}`)
          return null
        }
        def.children.push(child)
      }
    } 
    // 创建连接
    root.prepare(def)
  }

  return root
}


const spawnSimulator = function(option) { 
  if (!option.model) {
    logger.error(`DevsSpawn::spawnAtomic failed - model is null`)
    return null
  }

  let root = spawnModel(option.model)
  // 原子仿真器
  let simulator = new DevsAtomicSimulator(root)
  simulator.snapshot(option)

  return simulator
}

const spawnCoordinator = function(option) { 
  if (!option.model) {
    logger.error(`DevsSpawn::spawnCoupled failed - option.model is null`)
    return null
  }

  let root = spawnModel(option.model)
  // 耦合仿真器
  let coordinator = new DevsCoordinator(root)
  coordinator.snapshot(option)
 
  return coordinator
}

const DevsSpawn = {
  spawn: function(option){
    if (!option) {
      logger.error(`DevsSpawn::spawn failed - option is null`)
      return null
    }

    if (version.isOlder(option.version)) {
      logger.error(`DevsSpawn::spawn failed - data version is older, current is ${version.current}`)
      return null
    }

    if (option.type === 'simulator') {
      return spawnSimulator(option)
    } else if (option.type === 'coordinator') {
      return spawnCoordinator(option)
    }
    return null
  },
  spawnModel: spawnModel
}

export default DevsSpawn
