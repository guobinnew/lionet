"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _uniqid=_interopRequireDefault(require("uniqid")),_utils=_interopRequireDefault(require("./utils")),_verison=_interopRequireDefault(require("./verison")),_logger=_interopRequireDefault(require("./logger")),_message=_interopRequireDefault(require("./message"));function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var _=0;_<e.length;_++){var i=e[_];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function _createClass(t,e,_){return e&&_defineProperties(t.prototype,e),_&&_defineProperties(t,_),t}var DevsAtomicSimulator=function(){function e(t){_classCallCheck(this,e),this.__uid__=(0,_uniqid.default)(),this.__tl__=_utils.default.devs.time.Initial,this.__tn__=_utils.default.devs.time.Infinity,this.__output__=null,this.__owner__=t,this.__owner__.simulator(this)}return _createClass(e,[{key:"tl",value:function(){return this.__tl__}},{key:"tn",value:function(){return this.__tn__}},{key:"owner",value:function(){return this.__owner__}},{key:"output",value:function(){return this.__output__}},{key:"nextTN",value:function(){return this.__tn__}},{key:"simInject",value:function(t,e){t<=this.nextTN()&&this.wrapDeltafunc(t,e)}},{key:"initialize",value:function(t){var e=0<arguments.length&&void 0!==t?t:_utils.default.devs.time.Initial;this.__owner__?this.__owner__.initialize():_logger.default.error("DevsAtomicSimulator::initialize failed - model is null"),this.__tl__=e,this.__tn__=_utils.default.devs.time.Infinity,this.__output__=null,this.updateTN(this.__owner__.ta())}},{key:"simulate",value:function(t){if(this.__owner__)for(var e=0;e<t;e++)this.computeInputOutput(this.__tn__),this.wrapDeltafunc(this.__tn__,null);else _logger.default.error("DevsAtomicSimulator::simulate failed - model is null")}},{key:"computeInputOutput",value:function(t){this.equalTN(t)?(this.__output__=this.__owner__.output(),this.__output__.setTimestamp(t)):this.__output__=null}},{key:"wrapDeltafunc",value:function(t,e){if(e)this.equalTN(t)?this.__owner__.deltcon(t-this.__tl__,e):this.__owner__.deltext(t-this.__tl__,e);else{if(!this.equalTN(t))return;this.__owner__.deltint()}this.__tl__=t,this.updateTN(this.__owner__.ta())}},{key:"equalTN",value:function(t){return t===this.__tn__}},{key:"updateTN",value:function(t){t===_utils.default.devs.time.Infinity||this.__tl__===_utils.default.devs.time.Infinity?this.__tn__=_utils.default.devs.time.Infinity:this.__tn__=this.__tl__+t}},{key:"snapshot",value:function(t){return this.__owner__?t?void this.__owner__.snapshot(t.model):{type:"simulator",version:_verison.default.current,model:this.__owner__.snapshot()}:(_logger.default.error("DevsAtomicSimulator::snapshot failed - model is null"),null)}},{key:"toJson",value:function(){var t={tl:this.__tl__,tn:this.__tn__};return this.__output__&&(t.output=this.__output__.toJson()),t}},{key:"fromJson",value:function(t){if(!t)return _logger.default.error("DevsAtomicSimulator::fromJson failed - json is null"),null;_utils.default.common.isNumber(t.tl)?this.__tl__=t.tl:(_logger.default.warn("DevsAtomicSimulator::fromJson - tl is not a number"),this.__tl__=_utils.default.devs.time.Initial),_utils.default.common.isNumber(t.tn)?this.__tn__=t.tn:(_logger.default.warn("DevsAtomicSimulator::fromJson - tn is not a number"),this.__tn__=_utils.default.devs.time.Infinity),t.output?(this.__output__=new _message.default,this.__output__.fromJson(t.output)):this.__output__=null}}]),e}(),_default=DevsAtomicSimulator;exports.default=_default;