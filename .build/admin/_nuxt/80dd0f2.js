(window.webpackJsonp=window.webpackJsonp||[]).push([[1,17],{799:function(e,t,n){"use strict";var l=n(22);n.d(t,"a",(function(){return l}));var c=n(114);n.d(t,"b",(function(){return c}))},800:function(e,t,n){"use strict";n.r(t);n(20),n(12),n(25),n(38),n(39);var l=n(295),c=n(7),r=n(8),o=n(80),d=(n(63),n(471),n(17),n(40),n(41),n(827),n(81),n(297),n(113),n(296),n(199),n(21),n(115),n(294),n(13),n(474),n(863)),h=n.n(d),f=n(807),m=n(830),v=n(799),x=n(22);n(865);function w(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function k(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?w(Object(source),!0).forEach((function(t){Object(c.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):w(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var y={name:"MediaPicker",components:{InputSearch:f.default,InputNumber:m.default,VueCropper:h.a},props:{value:[Object,Array],limit:{type:Number,default:1},size:{type:[Number,String],default:48}},data:function(){return{activeTab:"gallery",medias:[],isShowDialog:!1,selected:[],clicked:null,width:null,height:null,addSizeToImage:null,itemForView:null,isShowView:!1,onUpload:!1,onCropImage:!1,files:[],clickedFile:null,scaleX:1,scaleY:1}},computed:{items:function(){return this.limit>1?this.value||[]:this.value?[this.value]:[]},clickedFileIsImage:function(){return!!this.isImage(this.clickedFile)},clickedFileUrl:function(){return this.clickedFileIsImage?URL.createObjectURL(this.clickedFile):""}},watch:{activeTab:function(){"upload"===this.activeTab&&(this.clickedFile=null)},clickedFile:function(){this.onCropImage=!1},isShowDialog:function(e){e&&(this.selected=[],this.getMedias())},clicked:function(e){if(this.width=null,this.height=null,e){var t=new URL(e.url).searchParams.get("size"),n=(null==t?void 0:t.split("x"))||[],l=Object(o.a)(n,2),c=l[0],r=l[1];this.width=c,this.height=r}},width:function(){this.addSizeToImage()},height:function(){this.addSizeToImage()}},created:function(){var e=this;this.addSizeToImage=Object(x.debounce)((function(){if(e.clicked)if(e.width||e.height){var t=new URL(e.clicked.url);t.searchParams.delete("size"),t.searchParams.append("size","".concat(e.width||"","x").concat(e.height||"")),e.clicked.url=t.toString()}else{var n=new URL(e.clicked.url);n.searchParams.delete("size"),e.clicked.url=n.toString()}}),500)},methods:{onLoadDialogPicker:function(e){console.log("onLoadDialogPicker",e)},getMedias:function(e){var t=this;return Object(r.a)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,t.$services.Media.find(t.$axios,k(k({query:{}},e),{},{pageSize:1e3}));case 2:t.medias=n.sent;case 3:case"end":return n.stop()}}),n)})))()},removeItem:function(e){this.limit>1?v.b.removeItems(this.value,(function(t){return t===e})):this.$emit("input",null)},showDialog:function(){this.isShowView=!1,this.isShowDialog=!0},closeDialog:function(){this.isShowView=!1,this.isShowDialog=!1},removeFile:function(e){v.b.removeItems(this.files,(function(t){return t===e})),this.clickedFile===e.file&&(this.clickedFile=null)},selectMedia:function(e){this.limit>1?this.selected.find((function(t){return t===e}))?(v.b.removeItems(this.selected,(function(t){return t===e})),this.clicked=null):(this.selected.push(e),this.clicked=e):(this.selected=[e],this.clicked=e)},confirm:function(){var e=function(e){return{url:e.url,alt:e.alt,name:e.name}};if(this.limit>1){var t=Array.isArray(this.value)?this.value:[];t.push.apply(t,Object(l.a)(this.selected.map(e))),t.splice(this.limit),this.$emit("input",t)}else this.$emit("input",this.selected[0]?e(this.selected[0]):void 0);this.isShowDialog=!1},createImageUrl:function(e){return URL.createObjectURL(e)},isImage:function(e){return!!/^image\/*/.test(e.type)},cancel:function(){this.isShowDialog=!1,this.selected=[],this.clicked=null},viewItem:function(e){this.isShowDialog=!1,this.itemForView=e,this.isShowView=!0},deleteMedia:function(e){var t=arguments,n=this;return Object(r.a)(regeneratorRuntime.mark((function l(){var c;return regeneratorRuntime.wrap((function(l){for(;;)switch(l.prev=l.next){case 0:if(c=!(t.length>1&&void 0!==t[1])||t[1],l.prev=1,!c){l.next=8;break}return l.next=5,n.$confirm("Bạn có chắc chắn muốn xóa?",{type:"warning"});case 5:l.t0=l.sent,l.next=9;break;case 8:l.t0=!0;case 9:if(!l.t0){l.next=15;break}return l.next=13,n.$services.Media.delete(n.$axios,{query:{id:e.id}});case 13:v.b.removeItems(n.medias,e,"id"),n.clicked.id===e.id&&(n.clicked=null);case 15:l.next=20;break;case 17:l.prev=17,l.t1=l.catch(1),console.error(l.t1);case 20:case"end":return l.stop()}}),l,null,[[1,17]])})))()},deleteMultipleMedia:function(){var e=this;this.$confirm("Bạn chắc chắn muốn xóa ".concat(this.selected.length," file?"),{type:"warning"}).then((function(){return Promise.all(e.selected.map((function(t){return e.deleteMedia(t,!1)})))}))},searchMedia:function(text){var e=this;return Object(r.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.getMedias({search:text,exact:!0});case 2:e.selected.forEach((function(t){e.medias.find((function(e){return e.id===t.id}))||e.medias.unshift(t)}));case 3:case"end":return t.stop()}}),t)})))()},handleSelectFile:function(e){var t=this;console.log("handleSelectFile",e,this.files),e.target.files.forEach((function(e){t.files.push({file:e,status:null,progress:0,url:null,response:null})}))},handleUpload:function(){var e=this;return Object(r.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.onUpload=!0,t.prev=1,t.next=4,Promise.all(e.files.map((function(t){if("success"!==t.status){var n=t.file;return t.status="uploading",e.$services.Upload.upload(e.$axios,n,(function(progress){t.progress=progress})).then((function(e){t.response=e,t.url=e.url,t.status="success"})).catch((function(e){console.log("upload error",e),t.status="error"}))}})));case 4:t.next=9;break;case 6:t.prev=6,t.t0=t.catch(1),console.error(t.t0);case 9:e.onUpload=!1;case 10:case"end":return t.stop()}}),t,null,[[1,6]])})))()},showCropImage:function(){this.onCropImage=!0},cropImage:function(){var e=this;this.$refs.cropper.getCroppedCanvas().toBlob((function(t){var n=e.files.findIndex((function(t){return t.file===e.clickedFile})),l=new File([t],e.clickedFile.name,{lastModified:(new Date).getTime(),type:t.type});e.clickedFile=l,n.file=l,e.onCropImage=!1}),this.clickedFile.type)},flipX:function(){this.scaleX=-1*this.scaleX,this.$refs.cropper.scaleX(this.scaleX)},flipY:function(){this.scaleY=-1*this.scaleY,this.$refs.cropper.scaleY(this.scaleY)},rotate:function(){this.$refs.cropper.rotate(90)}}},_=(n(867),n(4)),component=Object(_.a)(y,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"media-picker inline-flex flex-wrap w-full"},[e._l(e.items,(function(t,l){return n("div",{key:l,staticClass:"selected-item",style:{width:e.size+"px",height:e.size+"px"}},[n("img",{staticClass:"w-full h-full object-contain",attrs:{src:t.url,alt:t.alt},on:{click:function(n){return e.viewItem(t)}}}),e._v(" "),n("icon",{staticClass:"remove-button",attrs:{name:"el-icon-close"},on:{click:function(n){return e.removeItem(t)}}})],1)})),e._v(" "),!e.value||e.value.length<e.limit?n("div",{staticClass:"\n      cursor-pointer\n      add-item-button\n      inline-flex\n      items-center\n      justify-center\n      border-gray-700 border-dashed border\n      clickable\n    ",style:{width:e.size+"px",height:e.size+"px"},on:{click:e.showDialog}},[n("icon",{attrs:{name:"el-icon-plus"}})],1):e._e(),e._v(" "),n("el-dialog",{ref:"dialog",attrs:{visible:e.isShowDialog,title:"Chọn hình ảnh, video, file",width:"90%","append-to-body":"","modal-fade":!1,top:"5vh","custom-class":"media-picker-dialog"},on:{"update:visible":function(t){e.isShowDialog=t}}},[n("el-tabs",{model:{value:e.activeTab,callback:function(t){e.activeTab=t},expression:"activeTab"}},[n("el-tab-pane",{staticClass:"flex flex-col",staticStyle:{"max-height":"calc(90vh - 200px)"},attrs:{label:"Thư viện",name:"gallery"}},[n("div",{staticClass:"flex"},[n("div",{staticClass:"flex-1"},[e.selected.length?n("el-button",{attrs:{template:"delete",text:"Xóa "+e.selected.length+" file"},on:{click:e.deleteMultipleMedia}}):e._e()],1),e._v(" "),n("InputSearch",{staticClass:"ml-auto mb-2",staticStyle:{width:"auto"},attrs:{placeholder:"Tìm kiếm",size:"small"},on:{search:e.searchMedia}})],1),e._v(" "),n("div",{staticClass:"flex"},[n("div",{staticClass:"border-r overflow-y-auto flex-1",staticStyle:{"padding-right":"10px",height:"calc(90vh - 270px)"}},[n("div",{staticClass:"flex flex-wrap mb-auto pt-2 pl-1"},e._l(e.medias,(function(t){return n("div",{key:t.id,staticClass:"media-item cursor-pointer mr-2",class:{"is-selected":e.selected.find((function(e){return e.id===t.id}))},style:{width:"96px",height:"128px"},on:{click:function(n){return e.selectMedia(t)}}},[n("img",{staticClass:"object-contain",staticStyle:{height:"96px",width:"96px"},attrs:{src:t.url,alt:t.alt}})])})),0)]),e._v(" "),n("div",{staticClass:"overflow-y-auto",staticStyle:{width:"300px","margin-left":"10px",height:"calc(90vh - 270px)"}},[e.clicked?[n("img",{staticClass:"object-contain mb-2",staticStyle:{width:"156px","max-height":"200px"},attrs:{src:e.clicked.url,alt:e.clicked.alt}}),e._v(" "),n("div",{staticClass:"font-medium"},[e._v(e._s(e.clicked.name))]),e._v(" "),n("div",{staticClass:"text-sm"},[e._v("\n                "+e._s(e._f("date")(e.clicked.updatedAt,"DD/MM/YYYY HH:mm"))+"\n              ")]),e._v(" "),n("el-button",{attrs:{type:"text"},on:{click:function(t){return e.deleteMedia(e.clicked)}}},[e._v("\n                Xóa\n              ")]),e._v(" "),n("el-divider"),e._v("\n              Mô tả\n              "),n("el-input",{staticClass:"w-full mt-2",attrs:{placeholder:"description ..."},model:{value:e.clicked.alt,callback:function(t){e.$set(e.clicked,"alt",t)},expression:"clicked.alt"}}),e._v(" "),n("div",{staticClass:"mt-2"},[e._v("\n                Size\n                "),n("InputNumber",{staticStyle:{width:"96px"},attrs:{placeholder:"width"},model:{value:e.width,callback:function(t){e.width=t},expression:"width"}}),e._v("\n                x\n                "),n("InputNumber",{staticStyle:{width:"96px"},attrs:{placeholder:"height"},model:{value:e.height,callback:function(t){e.height=t},expression:"height"}})],1)]:e._e()],2)])]),e._v(" "),n("el-tab-pane",{attrs:{label:"Tải lên",name:"upload"}},[n("input",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],ref:"pickFile",attrs:{type:"file",multiple:""},on:{change:e.handleSelectFile}}),e._v(" "),n("el-button",{attrs:{template:"create",text:"Chọn file"},on:{click:function(){return e.$refs.pickFile.click()}}}),e._v(" "),e.files.find((function(e){return null===e.status}))?n("el-button",{attrs:{template:"save",text:"Tải lên",icon:"el-icon-upload",disabled:e.onUpload},on:{click:e.handleUpload}}):e._e(),e._v(" "),n("div",{staticClass:"flex mt-2 overflow-y-auto",staticStyle:{height:"calc(90vh - 270px)"}},[e.files.length?[n("div",{staticClass:"p-2 border-r overflow-y-auto",staticStyle:{width:"300px"}},e._l(e.files,(function(t,l){return n("div",{key:l,staticClass:"\n                  shadow\n                  rounded-lg\n                  px-2\n                  py-1\n                  cursor-pointer\n                  border-transparent border\n                  mb-2\n                  relative\n                ",class:{"border-blue-500":t.file===e.clickedFile},on:{click:function(n){e.clickedFile=t.file}}},[n("div",{staticClass:"flex"},[e.isImage(t.file)?n("img",{staticClass:"mr-2 object-contain",style:{width:e.width+"px",height:e.height+"px"},attrs:{src:e.createImageUrl(t.file)}}):e._e(),e._v(" "),n("div",{staticClass:"mr-2 flex-1"},[n("div",{staticClass:"font-medium"},[e._v(e._s(t.file.name))]),e._v(" "),n("div",{staticClass:"text-xs"},[e._v("\n                      "+e._s(e._f("number")(t.file.size,"0.[0] b"))+"\n                    ")])]),e._v(" "),n("el-button",{staticStyle:{"margin-top":"auto","margin-bottom":"auto"},attrs:{template:"table_delete"},nativeOn:{click:function(n){return n.stopPropagation(),e.removeFile(t)}}})],1),e._v(" "),t.status?n("el-progress",{attrs:{status:e._.get({uploading:null,success:"success",error:"error"},t.status),percentage:t.progress}}):e._e()],1)})),0),e._v(" "),n("div",{staticClass:"mr-2 flex-1 p-2 pb-2 overflow-y-auto"},[e.clickedFile?[e.onCropImage?[n("vue-cropper",{ref:"cropper",staticStyle:{"max-height":"calc(80vh - 250px)"},attrs:{src:e.clickedFileUrl}}),e._v(" "),n("div",{staticClass:"flex mt-2"},[n("div",{staticClass:"flex-1"},[n("el-button",{attrs:{type:"primary","icon-only":"",icon:"flip-x"},on:{click:e.flipX}}),e._v(" "),n("el-button",{attrs:{type:"primary","icon-only":"",icon:"flip-y"},on:{click:e.flipY}}),e._v(" "),n("el-button",{attrs:{type:"primary","icon-only":"",icon:"el-icon-refresh-right"},on:{click:e.rotate}})],1),e._v(" "),n("div",[n("el-button",{attrs:{template:"cancel"},on:{click:function(t){e.onCropImage=!1}}}),e._v(" "),n("el-button",{attrs:{template:"save",icon:"el-icon-crop",text:"crop"},on:{click:e.cropImage}})],1)])]:[e.clickedFileIsImage?n("div",{staticClass:"relative",staticStyle:{width:"50%","min-width":"300px"}},[n("img",{staticStyle:{width:"100%"},attrs:{src:e.clickedFileUrl}}),e._v(" "),n("el-button",{staticStyle:{top:"8px",right:"8px",position:"absolute"},attrs:{icon:"el-icon-crop","icon-only":""},on:{click:e.showCropImage}})],1):e._e(),e._v(" "),n("div",{staticClass:"font-medium"},[e._v(e._s(e.clickedFile.name))]),e._v(" "),n("div",{staticClass:"text-xs"},[e._v("\n                    "+e._s(e._f("number")(e.clickedFile.size,"0.[0] b"))+"\n                  ")])]]:e._e()],2)]:n("div",[e._v("Chọn file để tải lên")])],2)],1)],1),e._v(" "),n("el-divider"),e._v(" "),n("div",{staticClass:"w-full flex justify-end"},[n("el-button",{attrs:{template:"cancel"},on:{click:e.cancel}}),e._v(" "),n("el-button",{attrs:{template:"save",text:"Chọn"},on:{click:e.confirm}})],1)],1),e._v(" "),n("el-dialog",{attrs:{visible:e.isShowView,title:e._.get(e.itemForView,"name"),width:"80%","append-to-body":"","custom-class":"media-viewer-dialog"},on:{"update:visible":function(t){e.isShowView=t}}},[e.itemForView?[n("img",{staticClass:"w-full object-contain",staticStyle:{"max-height":"400px"},attrs:{src:e.itemForView.url,alt:e.itemForView.alt}}),e._v(" "),n("br"),e._v("\n      Mô tả\n      "),n("el-input",{attrs:{placeholder:"Mô tả"},model:{value:e.itemForView.alt,callback:function(t){e.$set(e.itemForView,"alt",t)},expression:"itemForView.alt"}})]:e._e(),e._v(" "),n("div",{staticClass:"flex justify-end mt-2"},[n("el-button",{attrs:{template:"save"},on:{click:function(t){e.isShowView=!1}}},[e._v("Ok")])],1)],2)],2)}),[],!1,null,null,null);t.default=component.exports;installComponents(component,{Icon:n(198).default,InputSearch:n(807).default,InputNumber:n(830).default})},807:function(e,t,n){"use strict";n.r(t);n(471);var l=n(799),c={name:"InputSearch",props:{placeholder:{type:String,default:"Nhập để tìm kiếm..."},value:[String,Number],debounce:{type:Number,default:500},prefixIcon:{type:String,default:"el-icon-search"},loading:{type:Boolean,default:!1},size:{type:String},searchOnFocus:{type:Boolean,default:!1}},data:function(){var data={cValue:""};return data.handleInput=this.debounce?l.a.debounce(this.onInput,this.debounce):this.onInput,data},watch:{value:{handler:function(e){this.cValue=e},immediate:!0}},methods:{onInput:function(e){this.$emit("input",e),this.$emit("search",e)},handleFocus:function(){console.log("handleFocus"),this.searchOnFocus&&this.onInput(this.cValue)}}},r=n(4),component=Object(r.a)(c,(function(){var e=this,t=e.$createElement;return(e._self._c||t)("el-input",{staticClass:"input-search",attrs:{placeholder:e.placeholder,"prefix-icon":e.prefixIcon,"suffix-icon":e.loading?"el-icon-loading":"",size:e.size},on:{input:e.handleInput,focus:e.handleFocus},model:{value:e.cValue,callback:function(t){e.cValue=t},expression:"cValue"}})}),[],!1,null,null,null);t.default=component.exports},830:function(e,t,n){"use strict";n.r(t);n(471),n(842);var l=n(34),c=n(285),r=n(799),o={name:"InputNumber",extends:l.Input,props:{max:{type:Number,default:1/0},min:{type:Number,default:-1/0},format:{type:String,default:"0,0.[000000000]"},nullValue:{type:[Number,String],default:null}},computed:{nativeInputValue:function(){var e;return r.a.isNil(this.value)?String(null!==(e=this.nullValue)&&void 0!==e?e:""):Object(c.a)(this.value).format(this.format)}},methods:{handleInput:function(e){var t=this;if(!this.isComposing&&e.target.value!==this.nativeInputValue){var n=this.$refs.input.selectionStart,l=this.nativeInputValue,r=Object(c.a)(e.target.value),o=r.value();isNaN(o)||(o>this.max?(r=Object(c.a)(String(this.max)),o=this.max):o<this.min&&(r=Object(c.a)(String(this.min)),o=this.min),r._input.endsWith(".")||(this.$emit("input",o),this.setNativeInputValue(),this.$nextTick((function(){var e=(t.nativeInputValue||"").length-(l||"").length;0===e&&(t.$refs.input.selectionEnd=n),e>0&&(t.$refs.input.selectionEnd=n+(e-1)),e<0&&(t.$refs.input.selectionEnd=n+(e+1))}))))}},handleBlur:function(e){this.focused=!1,this.$emit("blur",e);var t=this.getInput().value,n=Object(c.a)(t).value();isNaN(n)&&this.setNativeInputValue(),this.validateEvent&&this.dispatch("ElFormItem","el.form.blur",[this.value])}}},d=n(4),component=Object(d.a)(o,undefined,undefined,!1,null,null,null);t.default=component.exports},847:function(e,t,n){var content=n(868);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(33).default)("24bf3b97",content,!0,{sourceMap:!1})},867:function(e,t,n){"use strict";n(847)},868:function(e,t,n){var l=n(32)(!1);l.push([e.i,".media-picker .selected-item{position:relative;display:inline-block;--bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--bg-opacity));border-radius:.25rem}.media-picker .selected-item,.media-picker .selected-item .remove-button{cursor:pointer;box-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06)}.media-picker .selected-item .remove-button{position:absolute;right:-4px;top:-4px;background:#fff;color:red;border-radius:8px}.media-picker .selected-item .remove-button:hover{transform:scale(1.2)}.media-picker .selected-item+.add-item-button,.media-picker .selected-item+.selected-item{margin-left:12px}.media-picker .add-item-button,.media-picker .selected-item{margin-bottom:12px}.media-picker-dialog{max-height:90vh;overflow:hidden}.media-picker-dialog .media-item img{border-width:1px;--border-opacity:1;border-color:#e2e8f0;border-color:rgba(226,232,240,var(--border-opacity))}.media-picker-dialog .media-item.is-selected img{box-shadow:0 0 2px 2px #3182ce}",""]),e.exports=l}}]);