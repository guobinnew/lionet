import uniqid from 'uniqid'
import utils from './utils'

/**
 * 组件模型基类
 */
 class DevsAtomicSimulator {
   constructor(atomic){
     this.__uid__ = uniqid()
     this.__tl__ = utils.devs.time.Initial
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

   /**
    * 
    * @param {*} timestamp 
    * @param {*} msg 
    */
   simInject(timestamp, msg){
     // 如果输入激励的时间小于下一次仿真时间
     if (timestamp <= this.nextTN()) {
       this.wrapDeltafunc(timestamp, msg)
     }
   }

   /**
    * 初始化
    * @param {*} startTime 起始⌚️，默认为0
    */
   initialize(startTime = utils.devs.time.Initial){
     this.__owner__.initialize()
     this.__tl__ = startTime
     this.__tn__ = utils.devs.time.Infinity
     this.__output__ = null
     this.updateTN(this.__owner__.ta())
   }

   /**
    * 仿真推进
    * @param {*} loop  为仿真循环次数
    */
   simulate(loop){
      // 当下一次仿真时间不是无穷大，且仿真循环次数不够则进行仿真计算
      for (let i = 0; i < loop; i++) {
        this.computeInputOutput(this.__tn__)
        this.wrapDeltafunc(this.__tn__, null)
      }
   }

   computeInputOutput(curTime){
     if (this.equalTN(curTime)){
       this.__output__ = this.__owner__.output()
       this.__output__.setTimestamp(curTime)
     } else {
       this.__output__ = null
     }
   }


   /**
    * 
    * @param {*} curTime 
    * @param {*} msg 
    */
   wrapDeltafunc(curTime, msg){
     // 如果外部消息为空，当前时间不等于tN，则不进行处理，也不更新当前时间
     if (!msg){
      if(!this.equalTN(curTime)){
        return
      } else {
        // 内部变迁处理
        this.__owner__.deltint()
      }
     } else {
      if(!this.equalTN(curTime)){
        // 外部变迁处理
        this.__owner__.deltext( curTime - tL_, msg)
      } else {
        // 进行冲突处理
				this.__owner__.deltcon( curTime - tL_, msg)
      }
     }

     // 重新计算仿真时间
			this.__tl__ = curTime;
			this.updateTN( this.__owner__.ta() )
   }

   /**
    * 是否相等（绝对时间）
    * @param {*} curTime 
    */
   equalTN(curTime){
     return curTime === this.__tn__
   }

   /**
    * 更新下一次仿真时间（相对时间）
    * @param {*} delta number
    */
   updateTN(delta){
     if (delta === utils.devs.time.Infinity || this.__tl__ === utils.devs.time.Infinity){
       this.__tn__ = utils.devs.time.Infinity
     } else {
       this.__tn__ = this.__tl__ + delta
     }
   }

 }

 export default DevsAtomicSimulator