"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _model=_interopRequireDefault(require("./model")),_utils=_interopRequireDefault(require("./utils")),_logger=_interopRequireDefault(require("./logger"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}function _possibleConstructorReturn(e,t){return!t||"object"!==_typeof(t)&&"function"!=typeof t?_assertThisInitialized(e):t}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _get(e,t,r){return(_get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,r){var o=_superPropBase(e,t);if(o){var l=Object.getOwnPropertyDescriptor(o,t);return l.get?l.get.call(r):l.value}})(e,t,r||e)}function _superPropBase(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=_getPrototypeOf(e)););return e}function _getPrototypeOf(e){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}function _setPrototypeOf(e,t){return(_setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var DevsCoupled=function(e){function p(e){var t;return _classCallCheck(this,p),(t=_possibleConstructorReturn(this,_getPrototypeOf(p).call(this,e))).__coordinator__=null,t}return _inherits(p,_model.default),_createClass(p,[{key:"add",value:function(e){if(e instanceof _model.default){var t=e.name();this.__children__.has(t)&&_logger.default.warn("DevsCoupled::add - found duplicated name: ".concat(t)),this.__children__.set(t,e)}else _logger.default.error("DevsCoupled::add failed - child is not a DevsModel")}},{key:"children",value:function(){return this.__children__}},{key:"couprels",value:function(){return this.__couprels__}},{key:"coordinator",value:function(e){if(!e)return this.__coordinator__;_utils.default.common.isObject(e)?this.__coordinator__=e:_logger.default.error("DevsCoupled::coordinator failed - invalid param ".concat(e))}},{key:"child",value:function(e){return _utils.default.common.isString(e)?e===this.name()?this:this.__children__.get(e):(_logger.default.error("DevsCoupled::child failed - name is not a string"),null)}},{key:"addCouprel",value:function(e,t){if(e&&t){var r=e.model;if(r instanceof _model.default||(r=this.child(e.model)),r){var o=t.model;if(o instanceof _model.default||(o=this.child(t.model)),o){r===this?r.addInport(e.port):r.addOutport(e.port),o===this?o.addOutport(t.port):o.addInport(t.port);var l={srcModel:r,srcPort:e.port,destModel:o,destPort:t.port},n=this.couprelHandle(l);this.__couprels__.has(n)?_logger.default.warn("DevsCoupled::addCouprel failed - found duplicated couprel: ".concat(e," ").concat(t)):this.__couprels__.set(n,l)}else _logger.default.error("DevsCoupled::addCouprel failed - dest is invalid")}else _logger.default.error("DevsCoupled::addCouprel failed - src is invalid")}}},{key:"couprelHandle",value:function(e){return e&&e.srcModel&&e.destModel?_utils.default.common.hashString(e.srcModel.id()+":"+e.srcPort+">"+e.destModel.id()+":"+e.destPort):(_logger.default.error("DevsCoupled::couprelHandle failed - couprel is invalid"),null)}},{key:"hasCouprel",value:function(e){if(!e)return _logger.default.error("DevsCoupled::hasCouprel failed - couprel is null"),!1;var t=this.couprelHandle(e);return this.__couprels__.has(t)}},{key:"initialize",value:function(){var e=!0,t=!1,r=void 0;try{for(var o,l=this.__children__.values()[Symbol.iterator]();!(e=(o=l.next()).done);e=!0){o.value.initialize()}}catch(e){t=!0,r=e}finally{try{e||null==l.return||l.return()}finally{if(t)throw r}}}},{key:"toJson",value:function(){var e=new Array,t=!0,r=!1,o=void 0;try{for(var l,n=this.__children__.values()[Symbol.iterator]();!(t=(l=n.next()).done);t=!0){var i=l.value;e.push(i.toJson())}}catch(e){r=!0,o=e}finally{try{t||null==n.return||n.return()}finally{if(r)throw o}}var u=new Array,a=!0,s=!1,c=void 0;try{for(var d,_=this.__couprels__.values()[Symbol.iterator]();!(a=(d=_.next()).done);a=!0){var f=d.value;u.push({src:f.src.name(),srcPort:f.src.portName(f.srcPortHandle),dest:f.dest.name(),destPort:f.dest.portName(f.destPortHandle)})}}catch(e){s=!0,c=e}finally{try{a||null==_.return||_.return()}finally{if(s)throw c}}return Object.assign(_get(_getPrototypeOf(p.prototype),"toJson",this).call(this),{children:e,couprels:u})}},{key:"fromJson",value:function(e){if(_get(_getPrototypeOf(p.prototype),"fromJson",this).call(this,e),this.__children__?this.__children__.clear():this.__children__=new Map,this.__couprels__?this.__couprels__.clear():this.__couprels__=new Map,_utils.default.common.isArray(e.children)){var t=!0,r=!1,o=void 0;try{for(var l,n=e.children[Symbol.iterator]();!(t=(l=n.next()).done);t=!0)l.value}catch(e){r=!0,o=e}finally{try{t||null==n.return||n.return()}finally{if(r)throw o}}}if(_utils.default.common.isArray(e.couprels)){var i=!0,u=!1,a=void 0;try{for(var s,c=e.couprels[Symbol.iterator]();!(i=(s=c.next()).done);i=!0)s.value}catch(e){u=!0,a=e}finally{try{i||null==c.return||c.return()}finally{if(u)throw a}}}}}]),p}(),_default=DevsCoupled;exports.default=_default;