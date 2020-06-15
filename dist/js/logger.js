"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _logLevels=["off","error","warn","info","log","debug"],_levelMap={};function _makeLevelMap(){_logLevels.forEach(function(l){var o=_logLevels.indexOf(l);_levelMap[l]={},_logLevels.forEach(function(e){_logLevels.indexOf(e)<=o&&(_levelMap[l][e]=!0)})})}_makeLevelMap();var _level="log";function _checkLevel(e){var l=_level||"log";return _levelMap[l]&&_levelMap[l][e]}var logger={setLevel:function(e){_level=e||"log"},debug:function(){if(_checkLevel("debug")){for(var e=arguments.length,l=new Array(e),o=0;o<e;o++)l[o]=arguments[o];console.debug.apply(console,l)}},log:function(){if(_checkLevel("log")){for(var e=arguments.length,l=new Array(e),o=0;o<e;o++)l[o]=arguments[o];console.log.apply(console,l)}},info:function(){if(_checkLevel("info")){for(var e=arguments.length,l=new Array(e),o=0;o<e;o++)l[o]=arguments[o];console.info.apply(console,l)}},warn:function(){if(_checkLevel("warn")){for(var e=arguments.length,l=new Array(e),o=0;o<e;o++)l[o]=arguments[o];console.warn.apply(console,l)}},error:function(){if(_checkLevel("error")){for(var e=arguments.length,l=new Array(e),o=0;o<e;o++)l[o]=arguments[o];console.error.apply(console,l)}}},_default=logger;exports.default=logger;