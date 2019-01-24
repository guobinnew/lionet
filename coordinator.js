import utils from './utils'
import logger from './logger'

/**
 * 	耦合模型仿真器（用于顶层耦合模型的运行）
 */
class DevsCoordinator {
  /**
   * 
   * @param {*} config 
   * {
   *    timestamp: number
   *    params: [object]
   * }
   */
  constructor(coupled){
    this.__coupled__ = coupled
    this.__couprels__ = coupled.couprels()
    this.__extCouprels__ = new Map()
    this.__simulators__ = new Set()
    this.__tl__ = utils.devs.time.Initial
    this.__tn__ = utils.devs.time.Infinity
    this.__input__ = null
    this.__output__ = null

    this.setSimulators()
    this.informCoupling()
  }

  /**
   * 
   */
  tl(){
    return this.__tl__
  }
  
  /**
   * 
   */
  tn(){
    return this.__tn__
  }

  /**
   * 
   * @param {*} startTime 
   */
  initialize(startTime = utils.devs.time.Initial){

  }

  /**
   * 
   * @param {*} loop 
   */
  simulate(loop){

  }

  /**
   * 
   * @param {*} timestamp 
   * @param {*} msg 
   */
  simInject(timestamp, msg){

  }

  /**
   * 
   * @param {*} curTime 
   */
  computeInputOutput(curTime){

  }

  /**
   * 
   * @param {*} curTime 
   */
  wrapDeltafunc(curTime){

  }

  /**
   * 
   */
  nextTN(){

  }

  /**
   * 
   */
  output(){
    return this.__output__
  }

  /**
   * 是否有外部信息
   */
  hasInjectMessage(){

  }
  
  /**
   * 插入输入事件
   * @param {*} msg 
   */
  injectMessage(msg){

  }

  /**
   * 
   * @param {*} contents 
   */
  putMessages(contents){

  }

  /**
   * 协调器对应的耦合模型
   */
  coupled(){
    return this.__coupled__
  }

  informCoupling(){

  }

  /**
   * 根据耦合模型组成配置仿真器
   */
  setSimulators(){

  }

  /**
   * 
   * @param {*} atomic 
   */
  addSimulator(atomic){

  }

  /**
   * 
   * @param {*} coupled 
   */
  addCoordinator(coupled){

  }

  /**
   * 
   */
  sendDownMessages(){

  }

  /**
   * 
   * @param {*} msg 
   */
  convertInput(msg){

  }

  /**
   * 
   * @param {*} relation 
   */
  addExtCouprel(relation){

  }

}

export default DevsCoordinator