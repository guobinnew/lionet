import DevsModel from './model'
import utils from './utils'
import logger from './logger'

class DevsAtomic extends DevsModel{
  /**
   * 构造函数
   * @param {*} config 
   *  {
   *     继承 DevsModel
   *     states: [object | string]  状态列表
   *     {
   *        name: string 状态名 不能为空 
   *        value: number 状态值 (0为保留值，不能使用)
   *     }
   *  }
   */
  constructor(config){
    super(config)
    this.__simulator__ = null // 模型执行器
  }

  /**
   * 注册状态
   * @param state string
   * @param handle number 0为保留空闲状态（
   */
  registerState(option){
    if (!utils.common.isObject(option) || utils.common.isString(option.name)){
      logger.error(`DevsAtomic::registerState failed - invalide param`)
      return 
    }

    let n = utils.common.trimString(option.name)
    if (n.length === 0){
      logger.error(`DevsAtomic::registerState failed - option.name is invalid`)
      return 
    }

    let h = option.value
    if(!h){
      h = utils.common.hashString(n)
    } else if (!utils.common.isNumber(h)){
      logger.error(`DevsAtomic::registerState failed - option.handle is not number`)
      return
    }

    // 检测是否重复
    if(this.__stateHandles__.has(h)) {
      logger.warn(`DevsAtomic::registerState failed - option.handle is added : ${option}`)
      return
    }

    this.__stateHandles__.set(h, n)
  }

  /**
   * 下一次推进时间（相对当前时刻的时间）
   * @return number 
   */
  ta(){
    return this.__sigma__
  }

  /**
   * 当前状态
   * @return number
   */
  phase(){
    return this.__phase__
  }

  /**
   * 获取/设置当前状态的sigma
   * @delta number 
   * @return number
   */
  sigma(delta){
    if (!delta) {
      return this.__sigma__
    }

    if (!utils.common.isNumber(delta)) {
      logger.error(`DevsAtomic::sigma failed - delta <${delta}> is not number`)
      return
    }

    this.__sigma__ = delta
  }

  /**
   * 获取/设置仿真器
   * @param {*} sim 
   */
  simulator(sim){
    if (!sim) {
      return this.__simulator__
    }

    if (!utils.common.isObject(sim)) {
      logger.error(`DevsAtomic::simulator failed - invalid param : ${sim}`)
      return
    }

    if (!sim.isDevsSimulator) {
      logger.error(`DevsAtomic::simulator failed - sim is not a DevsSimultor`)
      return
    }
    this.__simulator__ = sim
  }


  /**
   * 初始化（由仿真器调用）
   */
  initialize(){
  }

  /**
   * 外部变迁（delta为相对时间）
   * @delta number 相对前一次仿真时刻的时间
   * @msg object 外部事件
   */
  deltext(delta, msg){
  }

  /**
   * 内部状态变迁（仅发生在tN时刻）
   */
  deltint(){
  }

  /**
   * 输出（仅发生在tN时刻）
   */
  output(){
    return null
  }

  /**
   * 冲突事件处理（如果内部变迁和外部变迁同时发生则使用该函数）
   * @delta number 相对前一次仿真时刻的时间
   * @msg object 外部事件
   */
  deltcon(delta, msg){
    this.deltint()
    this.deltext(0, msg)
  }

  /**
   * 保持状态
   * @param delta number
   */
  resume(delta){
    // 如果不是永久保持，则更新Sigma
    if (this.__sigma__ < utils.devs.Time.infinity){
      let sigma = this.__sigma__ - delta
      if (sigma < 0) {
        logger.warn(`DevsAtomic::resume - sigma < 0`)
      }
      this.sigma(sigma)
    }
  }

  /**
   * 保持新状态
   * @param {*} state string | number 状态名或句柄
   * @param {*} delta number 保持时间
   */
  holdIn(state, delta){
    if (!utils.common.isString(state) && !utils.common.isNumber(state)){
      logger.error(`DevsAtomic::holdIn failed - state is invalid : ${state}`)
      return false
    }

    let handle = state
    if (utils.common.isString(handle)){
      handle = this.phaseHandle(handle)
    }

    if(!handle) {
      logger.error(`DevsAtomic::holdIn failed - state <${state}> can not found`)
      return
    }

    this.__phase__ = handle
    this.sigma(delta)
  }

  /**
   * 永久停留在指定状态
   * @param {*} state  string | number 状态名或句柄
   */
  passivateIn(state){
    this.holdIn(state, utils.devs.time.Infinity)
  }

  /**
   * 检查当前状态
   * @param {*} state  string | number 状态名或句柄
   * @return boolean
   */
  phaseIs(state){
    if (!utils.common.isString(state) && !utils.common.isNumber(state)){
      logger.error(`DevsAtomic::phaseIs failed - state is invalid : ${state}`)
      return false
    }
    
    let h = state
    if (utils.common.isString(h)){
      h = this.phaseHandle(h)
    }
    
    if (!utils.common.isNumber(h)){
      return false
    }

    return this.__phase__ === h
  }

  phaseName(handle){
    if (!utils.common.isNumber(handle)){
      logger.error(`DevsAtomic::phaseName failed - handle is invalid : ${handle}`)
      return null
    }

    if(this.__portHandles__.has(handle)){
      return null
    }
    return this.__portHandles__.get(handle)
  }

  /**
   * 获取状态句柄
   * @param {*} name 
   * @return number | null
   */
  phaseHandle(name){
    if (!utils.common.isString(name)){
      logger.error(`DevsAtomic::phaseHandle failed - name is invalid : ${name}`)
      return null
    }
    let handle = null
    for(let [key, value] of this.__stateHandles__.entries()){
      if (value === name) {
        handle = key
        break
      }
    }
    return handle
  }

   /**
   * 
   */
  toJson() {
    let states = new Array()
    for(let [key, value] of this.__stateHandles__.entries()){
      if (key === 0){ // 略过Passive
        continue
      }

      states.push({
        name: value,
        value: key
      })
    }
    return Object.assign(super.toJson(),
    {
      states: states
    })
  }

  /**
   * 
   * @param {*} json 
   */
  fromJson(json){
    super.fromJson(json)
    this.__sigma__ = 0 // 当前状态的剩余时间（相对时间）
    this.__phase__ = 0 // 当前状态句柄

    if (this.__stateHandles__) {
      this.__stateHandles__.clear()
    } else {
      this.__stateHandles__ = new Map()
    }

    // 注册状态
    let s = 'Passive'
    this.registerState({
      name: s,
      value: utils.devs.state[s]})

    if (utils.common.isArray(json.states)) {
      for(let s of json.states){
        if (utils.common.isString(s)){
          this.registerState({name: s})
        } else  if (utils.common.isObject(s)){
          if (s.handle === 0) {
            logger.error(`DevsAtomic::constructor failed - handle of state <${s.name}> is 0`)
            continue
          }
          this.registerState(s)
        } else {
          logger.error(`DevsAtomic::constructor failed - state is invalid : <${s}>`)
        }
      }
    }
  }
}

export default DevsAtomic