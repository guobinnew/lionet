"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _uniqid=_interopRequireDefault(require("uniqid"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}var DevsEntity=function(){function t(e){_classCallCheck(this,t),this.fromJson(Object.assign({uid:(0,_uniqid.default)(),name:""},e))}return _createClass(t,[{key:"id",value:function(){return this.__uid__}},{key:"name",value:function(){return this.__name__}},{key:"toJson",value:function(){return{uid:this.__uid__,name:this.__name__}}},{key:"fromJson",value:function(e){this.__uid__=e.uid,this.__name__=e.name}}]),t}(),_default=DevsEntity;exports.default=_default;