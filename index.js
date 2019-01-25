import utils from './utils'
import DevsModelRegister from './registry'
import DevsAtomic from './atomic'
import DevsEvent from './event'
import DevsMessage from './message'
import DevsAtomicSimulator from './atomic-simulator';

const Lionet = {
  Utils: utils,
  Register: DevsModelRegister,
  Atomic: DevsAtomic,
  Event: DevsEvent,
  Message: DevsMessage,
  AtomicSimulator: DevsAtomicSimulator
}

export default Lionet