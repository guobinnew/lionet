import utils from './utils'
import DevsModelRegister from './registry'
import DevsSpawn from './spawn'
import DevsAtomic from './atomic'
import DevsEvent from './event'
import DevsMessage from './message'
import DevsAtomicSimulator from './atomic-simulator'
import DevsCoupled from './coupled'
import DevsCoordinator from './coordinator'

const Lionet = {
  Utils: utils,
  Register: DevsModelRegister,
  Spawn: DevsSpawn,
  Atomic: DevsAtomic,
  Coupled: DevsCoupled,
  Event: DevsEvent,
  Message: DevsMessage,
  AtomicSimulator: DevsAtomicSimulator,
  CoupledCoordinator: DevsCoordinator
}

export default Lionet