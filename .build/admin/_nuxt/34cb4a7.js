(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{803:function(t,e,o){"use strict";o.r(e);var r={props:{to:String},data:function(){return{teleportTo:null}},watch:{to:function(){this.teleport()}},mounted:function(){this.teleport()},beforeDestroy:function(){this.removeTeleport()},methods:{teleport:function(){if(this.removeTeleport(),this.to&&(this.teleportTo=document.querySelector(this.to),this.teleportTo)){try{this.$parent.$el.removeChild(this.$el)}catch(t){}this.teleportTo.appendChild(this.$el)}},removeTeleport:function(){if(this.teleportTo)try{this.teleportTo.removeChild(this.$el)}catch(t){}}}},l=o(4),component=Object(l.a)(r,(function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"teleport"},[t._t("default")],2)}),[],!1,null,null,null);e.default=component.exports}}]);