import DevsEntity from './entity'
import utils from './utils'
import logger from './logger'

const atomicReg = new Map()
const DevsModelRegister = {
  register: function(name, proto){
    atomicReg.set(name,
      function(config){
        return new proto.prototype.constructor(config)
      })
  },
  proto: function(name){
    return atomicReg.get(name)
  }
}

export default DevsModelRegister

