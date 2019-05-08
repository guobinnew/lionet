# lionet
based-component state machine engine， suitable for games and simulation

## Principle

模型体系包含2种组件：Atomic和Coupled， Coupled组件由若干Atomic和Coupled组成。
+ 每个组件都是一个状态机，包含若干输入事件端口（Inport）、输出事件端口（Outport）和状态（Phase）
+ 组件在若干状态之间变换，当状态发生变化时，可以向外发送事件
+ 当组件接受到输入事件时，可以根据事件来决定下一步动作，继续保持当前状态或者切换状态
+ 每个状态都有一个生命时间Sigma，当生命耗尽时，触发动作决定下一个状态
+ 组件可以通过不断组合，形成十分复杂的Coupled组件

### Install

```
  npm install orion-lionet
```

## Usage



### Lionet.Atomic
Atomic组件基类，什么也不做，用于派生出Atomic组件模型
需要实现的接口函数：
+ initialize()
  用于组件初始化
+ deltext（delta, msg)
  外部事件处理回调函数，当接受到外部事件时触发
+ deltint()
  内部状态转换回调函数，当状态的生命时间Sigma耗尽时触发
+ output()
  生成当前状态的输出事件，例如更新状态、发送通知等

示例代码
```
import Lionet from ‘orion-lionet'

class Simple extends Lionet.Atomic {
  constructor(config){
    super(config)
    this.__step__ = config.step
    this.__msgid__ = 0
  }

	initialize(){
    this.addInport('in')
    this.addOutport('out')
    this.holdIn(Lionet.Utils.devs.state.Passive, this.__step__)
  }

	deltext(delta, msg){
    if (msg) {
      for(let content of msg.contents()){
        if (content.port === 'in') {
          console.log('receiving event: ' + content.event.toJson())
        }
      }
    }
    this.resume(delta)
  }

	deltint(){
    this.holdIn(Lionet.Utils.devs.state.Passive, this.__step__)
  }

	output(){
    let msg = new Lionet.Message()
    let evt = new Lionet.Event()
    evt.setParam('Number', this.__msgid__++)
    msg.setContent('out', evt)
    return msg
  }
}
```

### AtomicSimulator


### Demo


## TODO
- 增加状态修改接口，由仿真器传递到各个Atomic模型中
- 增加与决策引擎联通接口，仿真引擎修改黑板，决策引擎生产决策Action

## Release Notes
v1.1  实现引擎克隆接口