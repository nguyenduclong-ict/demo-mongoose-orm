(window.webpackJsonp=window.webpackJsonp||[]).push([[38],{882:function(e,t,r){"use strict";r.r(t);r(20),r(12),r(25),r(38),r(13),r(39);var n=r(7),o=r(31),c=r(147),l=r(286);function f(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}var d={data:function(){return{size:localStorage.getItem(c.a)}},computed:function(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?f(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):f(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}({},Object(o.c)(["fixedHeader"])),methods:{handleChangeSize:function(){Object(l.a)(this.size)},changeHeaderMode:function(e){console.log(e),this.$store.commit("TOGGLE_FIXED_HEADER",e),localStorage.setItem(c.b,e)}}},O=r(4),component=Object(O.a)(d,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("el-form",{ref:"form"},[r("el-form-item",{attrs:{label:"Fixed Header"}},[r("el-switch",{attrs:{value:e.fixedHeader,"active-color":"#13ce66","inactive-color":"#ff4949"},on:{change:e.changeHeaderMode}})],1),e._v(" "),r("el-form-item",{attrs:{label:"Size"}},[r("el-select",{on:{change:e.handleChangeSize},model:{value:e.size,callback:function(t){e.size=t},expression:"size"}},e._l(["default","mini","small","medium"],(function(s){return r("el-option",{key:s,attrs:{label:s,value:s}})})),1)],1)],1)],1)}),[],!1,null,"bd47b696",null);t.default=component.exports}}]);