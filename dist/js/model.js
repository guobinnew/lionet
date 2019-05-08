"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _entity=_interopRequireDefault(require("./entity")),_logger=_interopRequireDefault(require("./logger")),_utils=_interopRequireDefault(require("./utils"));function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(t,e){var r=[],o=!0,n=!1,a=void 0;try{for(var i,l=t[Symbol.iterator]();!(o=(i=l.next()).done)&&(r.push(i.value),!e||r.length!==e);o=!0);}catch(t){n=!0,a=t}finally{try{o||null==l.return||l.return()}finally{if(n)throw a}}return r}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var r=0;r<e.length;r++){var o=e[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function _createClass(t,e,r){return e&&_defineProperties(t.prototype,e),r&&_defineProperties(t,r),t}function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?_assertThisInitialized(t):e}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _get(t,e,r){return(_get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,r){var o=_superPropBase(t,e);if(o){var n=Object.getOwnPropertyDescriptor(o,e);return n.get?n.get.call(r):n.value}})(t,e,r||t)}function _superPropBase(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=_getPrototypeOf(t)););return t}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var DevsModel=function(t){function c(t){var e;return _classCallCheck(this,c),(e=_possibleConstructorReturn(this,_getPrototypeOf(c).call(this,t))).__inports__=new Set,e.__outports__=new Set,e.__portHandles__=new Map,e}return _inherits(c,_entity.default),_createClass(c,[{key:"prepare",value:function(t){if(_get(_getPrototypeOf(c.prototype),"prepare",this).call(this,t),_utils.default.common.isArray(t.ports)){this.__inports__.clear(),this.__outports__.clear(),this.__portHandles__.clear();var e=!0,r=!1,o=void 0;try{for(var n,a=t.ports[Symbol.iterator]();!(e=(n=a.next()).done);e=!0){var i=n.value;"in"===i.orientation?this.addInport(i.name):this.addOutport(i.name)}}catch(t){r=!0,o=t}finally{try{e||null==a.return||a.return()}finally{if(r)throw o}}}}},{key:"addInport",value:function(t){var e=_utils.default.common.hashString(t);return e?(this.__portHandles__.has(e)?_logger.default.warn("DevsModel::addInport - port <".concat(t,"> is already existed")):(this.__inports__.add(e),this.__portHandles__.set(e,t)),e):(_logger.default.error("DevsModel::addInport failed - invalid param"),0)}},{key:"addOutport",value:function(t){var e=_utils.default.common.hashString(t);return e?(this.__portHandles__.has(e)?_logger.default.warn("DevsModel::addOutport - port <".concat(t,"> is already existed")):(this.__outports__.add(e),this.__portHandles__.set(e,t)),e):(_logger.default.error("DevsModel::addOutport failed - invalid param"),0)}},{key:"portName",value:function(t){return!_utils.default.common.isNumber(t)||t<=0?(_logger.default.error("DevsModel::portName failed - handle <".concat(t,"> is invalid")),null):this.__portHandles__.has(t)?this.__portHandles__.get(t):null}},{key:"portHandle",value:function(t){if(!_utils.default.common.isString(t))return _logger.default.warn("DevsModel::portHandle failed - name <".concat(t,"> is invalid")),null;var e=null,r=!0,o=!1,n=void 0;try{for(var a,i=this.__portHandles__.entries()[Symbol.iterator]();!(r=(a=i.next()).done);r=!0){var l=_slicedToArray(a.value,2),u=l[0];if(l[1]===t){e=u;break}}}catch(t){o=!0,n=t}finally{try{r||null==i.return||i.return()}finally{if(o)throw n}}return e}},{key:"hasPort",value:function(t){return!_utils.default.common.isNumber(t)||t<=0?(_logger.default.error("DevsModel::hasPort failed - handle <".concat(t,"> is invalid")),!1):this.__portHandles__.has(t)}},{key:"inportNames",value:function(){var t=new Array,e=!0,r=!1,o=void 0;try{for(var n,a=this.__inports__[Symbol.iterator]();!(e=(n=a.next()).done);e=!0){var i=n.value;t.push(this.portName(i))}}catch(t){r=!0,o=t}finally{try{e||null==a.return||a.return()}finally{if(r)throw o}}return t}},{key:"outportNames",value:function(){var t=new Array,e=!0,r=!1,o=void 0;try{for(var n,a=this.__outports__[Symbol.iterator]();!(e=(n=a.next()).done);e=!0){var i=n.value;t.push(this.portName(i))}}catch(t){r=!0,o=t}finally{try{e||null==a.return||a.return()}finally{if(r)throw o}}return t}},{key:"dump",value:function(){var t=new Array,e=!0,r=!1,o=void 0;try{for(var n,a=this.__inports__[Symbol.iterator]();!(e=(n=a.next()).done);e=!0){var i=n.value;t.push({orientation:"in",name:this.portName(i)})}}catch(t){r=!0,o=t}finally{try{e||null==a.return||a.return()}finally{if(r)throw o}}var l=!0,u=!1,s=void 0;try{for(var _,f=this.__outports__[Symbol.iterator]();!(l=(_=f.next()).done);l=!0){var p=_.value;t.push({orientation:"out",name:this.portName(p)})}}catch(t){u=!0,s=t}finally{try{l||null==f.return||f.return()}finally{if(u)throw s}}return Object.assign(_get(_getPrototypeOf(c.prototype),"dump",this).call(this),{ports:t})}}]),c}(),_default=DevsModel;exports.default=_default;