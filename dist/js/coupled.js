"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _model=_interopRequireDefault(require("./model")),_utils=_interopRequireDefault(require("./utils")),_logger=_interopRequireDefault(require("./logger"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}function _possibleConstructorReturn(e,t){return!t||"object"!==_typeof(t)&&"function"!=typeof t?_assertThisInitialized(e):t}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _get(e,t,r){return(_get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,r){var o=_superPropBase(e,t);if(o){var n=Object.getOwnPropertyDescriptor(o,t);return n.get?n.get.call(r):n.value}})(e,t,r||e)}function _superPropBase(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=_getPrototypeOf(e)););return e}function _getPrototypeOf(e){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}function _setPrototypeOf(e,t){return(_setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var DevsCoupled=function(e){function p(e){var t;return _classCallCheck(this,p),(t=_possibleConstructorReturn(this,_getPrototypeOf(p).call(this,e))).__coordinator__=null,t.__children__=new Map,t.__couprels__=new Map,t}return _inherits(p,_model.default),_createClass(p,[{key:"prepare",value:function(e){if(e){if(_get(_getPrototypeOf(p.prototype),"prepare",this).call(this,e),this.__children__.clear(),_utils.default.common.isArray(e.children)){var t=!0,r=!1,o=void 0;try{for(var n,l=e.children[Symbol.iterator]();!(t=(n=l.next()).done);t=!0){var i=n.value;this.add(i)}}catch(e){r=!0,o=e}finally{try{t||null==l.return||l.return()}finally{if(r)throw o}}}if(this.__couprels__.clear(),_utils.default.common.isArray(e.links)){var a=!0,u=!1,s=void 0;try{for(var c,f=e.links[Symbol.iterator]();!(a=(c=f.next()).done);a=!0){var d=c.value;this.addCouprel(d)}}catch(e){u=!0,s=e}finally{try{a||null==f.return||f.return()}finally{if(u)throw s}}}}}},{key:"add",value:function(e){if(e instanceof _model.default){var t=e.name();this.__children__.has(t)&&_logger.default.warn("DevsCoupled::add - found duplicated name: ".concat(t)),this.__children__.set(t,e)}else _logger.default.error("DevsCoupled::add failed - child is not a DevsModel")}},{key:"children",value:function(){return this.__children__}},{key:"couprels",value:function(){return this.__couprels__}},{key:"coordinator",value:function(e){if(!e)return this.__coordinator__;_utils.default.common.isObject(e)?this.__coordinator__=e:_logger.default.error("DevsCoupled::coordinator failed - invalid param ".concat(e))}},{key:"child",value:function(e){return _utils.default.common.isString(e)?e===this.name()?this:this.__children__.get(e):(_logger.default.error("DevsCoupled::child failed - name is not a string"),null)}},{key:"addCouprel",value:function(e){if(e){var t=Object.assign({},e);if(t.src=this.child(t.src),t.src)if(t.dest=this.child(e.dest),t.dest){t.src===this&&this.addInport(e.srcPort),t.dest===this&&this.addOutport(e.destPort);var r=this.couprelHandle(t);this.__couprels__.has(r)?_logger.default.warn("DevsCoupled::addCouprel failed - found duplicated couprel: ".concat(e)):this.__couprels__.set(r,t)}else _logger.default.error("DevsCoupled::addCouprel failed - dest <".concat(e.dest,"> is invalid"));else _logger.default.error("DevsCoupled::addCouprel failed - src <".concat(e.src,"> is invalid"))}}},{key:"couprelHandle",value:function(e){return e&&e.src&&e.dest?_utils.default.common.hashString(e.src.id()+":"+e.srcPort+">"+e.dest.id()+":"+e.destPort):(_logger.default.error("DevsCoupled::couprelHandle failed - couprel is invalid"),null)}},{key:"hasCouprel",value:function(e){if(!e)return _logger.default.error("DevsCoupled::hasCouprel failed - couprel is null"),!1;var t=this.couprelHandle(e);return this.__couprels__.has(t)}},{key:"initialize",value:function(){var e=!0,t=!1,r=void 0;try{for(var o,n=this.__children__.values()[Symbol.iterator]();!(e=(o=n.next()).done);e=!0){o.value.initialize()}}catch(e){t=!0,r=e}finally{try{e||null==n.return||n.return()}finally{if(t)throw r}}}},{key:"dump",value:function(){var e=new Array,t=!0,r=!1,o=void 0;try{for(var n,l=this.__children__.values()[Symbol.iterator]();!(t=(n=l.next()).done);t=!0){var i=n.value;e.push(i.dump())}}catch(e){r=!0,o=e}finally{try{t||null==l.return||l.return()}finally{if(r)throw o}}var a=new Array,u=!0,s=!1,c=void 0;try{for(var f,d=this.__couprels__.values()[Symbol.iterator]();!(u=(f=d.next()).done);u=!0){var _=f.value;a.push({src:_.src.name(),srcPort:_.srcPort,dest:_.dest.name(),destPort:_.destPort})}}catch(e){s=!0,c=e}finally{try{u||null==d.return||d.return()}finally{if(s)throw c}}return Object.assign(_get(_getPrototypeOf(p.prototype),"dump",this).call(this),{children:e,couprels:a})}},{key:"toJson",value:function(){var e=new Array,t=!0,r=!1,o=void 0;try{for(var n,l=this.__children__.values()[Symbol.iterator]();!(t=(n=l.next()).done);t=!0){var i=n.value;e.push(i.toJson())}}catch(e){r=!0,o=e}finally{try{t||null==l.return||l.return()}finally{if(r)throw o}}return Object.assign(_get(_getPrototypeOf(p.prototype),"toJson",this).call(this),{children:e})}},{key:"fromJson",value:function(e){_get(_getPrototypeOf(p.prototype),"fromJson",this).call(this,e)}},{key:"snapshot",value:function(e){if(!e)return this.toJson();this.fromJson(e)}}]),p}();DevsCoupled.prototype.__classId__="DevsCoupled";var _default=DevsCoupled;exports.default=_default;