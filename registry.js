import DevsModel from './model'
import DevsAtomic from './atomic'
import DevsCoupled from './coupled'
import utils from './utils'
import logger from './logger'

const atomicReg = new Map()
const DevsModelRegister = {
  register: function(proto){
    if (proto && utils.common.isSubclass(DevsModel, proto)) {
      atomicReg.set(proto.prototype.__classId__,
        function(name, config){
          return new proto.prototype.constructor(name, config)
        }
      )
    } else {
      logger.error(`DevsModelRegister::register failed - proto is not a devsmodel`)
      return null
    }
  },
  proto: function(name){
    return atomicReg.get(name)
  },
  has: function(name) {
    let ctor = atomicReg.get(name)
    return ctor != null
  },
  create: function(name, option) {
    let ctor = atomicReg.get(name)
    if (ctor) {
      if (!option) {
        return ctor.call(null, '')
      } else {
        let { name = '', config = null } = option
        return ctor.call(null, name, config)
      }
    }
    return null
  }
}

DevsModelRegister.register(DevsAtomic)
DevsModelRegister.register(DevsCoupled)

export default DevsModelRegister

