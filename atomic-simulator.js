import uniqid from 'uniqid'
import utils from './utils'
import DevsMessage from './message'

/**
 * 组件模型基类
 */
 class DevsAtomicSimulator {
   constructor(atomic){
     this.__uid__ = uniqid()
     this.__tl__ = 0
     this.__tn__ = utils.devs.time.Infinity
     this.__output__ = null
     this.__owner__ = atomic
   }

   tl(){
     return this.__tl__
   }

   tn(){
     return this.__tn__
   }

   owner(){
     return this.__owner__
   }

   output(){
     return this.__output__
   }

   nextTN(){
     return this.__tn__
   }

   simInject(timestamp, msg){

   }

   initialize(){

   }

   simulate(loop){

   }

   computeInputOutput(curTime){

   }
   
   wrapDeltafunc()

   /**
    * 是否相等（绝对时间）
    * @param {*} curTime 
    */
   equalTN(curTime){

   }

   /**
    * 更新下一次仿真时间（相对时间）
    * @param {*} delta number
    */
   updateTN(delta){

   }

 }

 export default DevsAtomicSimulator