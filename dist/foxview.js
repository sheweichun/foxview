!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).FoxView={})}(this,function(t){"use strict";var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function n(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function o(t,e){return t(e={exports:{}},e.exports),e.exports}var r=o(function(t,e){Object.defineProperty(e,"__esModule",{value:!0}),e.createMarker=function(){return document.createComment("")},e.marker="{{tiny-"+String(Math.random()).slice(2)+"}}",e.nodeMarker="\x3c!--"+e.marker+"--\x3e",e.markerRegex=new RegExp(e.marker+"|"+e.nodeMarker),e.boundAttributeSuffix="$tiny$";var n=new Map;e.matchLastAttributeName=function(t){var e=n.get(t);if(e)return e;var r=o.exec(t);return r&&n.set(t,r),r};var o=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=\/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/});n(r);r.createMarker,r.marker,r.nodeMarker,r.markerRegex,r.boundAttributeSuffix,r.matchLastAttributeName;var i=o(function(t,e){Object.defineProperty(e,"__esModule",{value:!0}),e.isCEPolyfill=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,e.clone=function(t){return e.isCEPolyfill?t.content.cloneNode(!0):document.importNode(t.content,!0)},e.reparentNodes=function(t,e,n,o){void 0===n&&(n=null),void 0===o&&(o=null);for(var r=e;r!==n;){var i=r.nextSibling;t.insertBefore(r,o),r=i}},e.removeNode=function(t){var e=t.parentNode;e&&e.removeChild(t)},e.removeAllNodes=function(t,e,n){void 0===n&&(n=null);for(var o=e;o!==n;){var r=o.nextSibling;t.removeChild(o),o=r}n&&t.removeChild(n)},e.removeNodes=function(t,e,n){void 0===n&&(n=null);for(var o=e;o!==n;){var r=o.nextSibling;t.removeChild(o),o=r}},e.removeAttributes=function(t,e){for(var n=0;n<e.length;n++)t.removeAttribute(e[n])}});n(i);i.isCEPolyfill,i.clone,i.reparentNodes,i.removeNode,i.removeAllNodes,i.removeNodes,i.removeAttributes;var s=o(function(t,n){var o,s=e&&e.__extends||(o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});Object.defineProperty(n,"__esModule",{value:!0});var a=function(){function t(t,e,n){this.strings=t,this.values=e,this.type=n}return t.prototype.getHTML=function(){for(var t=this.strings.length-1,e="",n=0;n<t;n++){var o=this.strings[n],i=r.matchLastAttributeName(o);e+=i?o.substr(0,i.index)+i[1]+i[2]+r.boundAttributeSuffix+i[3]+r.marker:o+r.nodeMarker}return e+=this.strings[t]},t.prototype.getTemplateElement=function(){var t=document.createElement("template");return t.innerHTML=this.getHTML(),t},t}();n.TemplateResult=a;var p=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return s(e,t),e.prototype.getHTML=function(){return"<svg>"+t.prototype.getHTML.call(this)+"</svg>"},e.prototype.getTemplateElement=function(){var e=t.prototype.getTemplateElement.call(this),n=e.content,o=n.firstChild;return n.removeChild(o),i.reparentNodes(n,o.firstChild),e},e}(a);n.SVGTemplateResult=p});n(s);s.TemplateResult,s.SVGTemplateResult;var a=o(function(t,e){Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(t){this._peons=[],this.mounted=!1,this.options=t}return t.prototype._prepareFrament=function(t){var e=this.options.templateProcessor(t,this.options),n=e.peons,o=e.fragment;this.fragment=o,this._peons=n},t.prototype.setValue=function(t){var e=this;this.fragment||this._prepareFrament(t),this.template=t,this._peons.forEach(function(t){t.setValue(e.template.values)})},t.prototype.commit=function(){this._peons.forEach(function(t){t.commit&&t.commit()})},t.prototype._destroy=function(){this._peons.forEach(function(t){t.destroy&&t.destroy()}),this._peons=null},t.prototype.isSameTemplate=function(t){if(this.template.type!==t.type)return!1;var e=this.template.strings,n=t.strings,o=e.length;if(o!==n.length)return!1;for(var r=0;r<o;r++)if(e[r]!==n[r])return!1;return!0},t}();e.TemplateInstance=n});n(a);a.TemplateInstance;var p=o(function(t,e){Object.defineProperty(e,"__esModule",{value:!0});var n,o=function(){function t(t,e,n,o){this._pendingValue=void 0,this._valueIndex=void 0,this._componentClass=t,this._propsSchemas=e,this._slots=n,this.options=o}return t.prototype.insertBeforeNode=function(t){var e=t.parentNode;this.fragment=document.createDocumentFragment(),this.endNode=e.insertBefore(r.createMarker(),t)},t.prototype.setValue=function(t){var e=this._propsSchemas.reduce(function(e,n){return e[n.name]=null!=n.index?t[n.index]:n.value,e},{});Object.freeze(e);var n=this._componentInstance;n?n._pendProps=e:((n=new this._componentClass(e))._mount=this._insert.bind(this),n.props=e,n._pendProps=e,n.fragment=this.fragment,n.renderOption=this.options,n._slots=this._slots,this._componentInstance=n)},t.prototype._insert=function(t){this.endNode.parentNode.insertBefore(t,this.endNode)},t.prototype.destroy=function(){var t=this._componentInstance;t.componentWillUnmount(),t._mount=null,t.part&&t.part.destroy(),this._slots=null,this.endNode=null,this.fragment=null},t.prototype.commit=function(){this._componentInstance.setState()},t}();e.ComponentPart=o,function(t){t[t.TemplateResult=0]="TemplateResult",t[t.ArrayResult=1]="ArrayResult",t[t.NodeValue=2]="NodeValue",t[t.Node=3]="Node",t[t.None=4]="None"}(n||(n={}));var p=function(){function t(t){var e;this._valueType=n.None,this._pendingValue=void 0,this._valueIndex=void 0,this._valueHandleMap=((e={})[n.TemplateResult]=this._setTemplateResultValue.bind(this),e[n.ArrayResult]=this._setIterableValue.bind(this),e),this.options=t}return t.prototype.appendInto=function(t){this.startNode=t.appendChild(r.createMarker()),this.endNode=t.appendChild(r.createMarker())},t.prototype.attachNode=function(t){this.startNode=r.createMarker(),this.endNode=r.createMarker();var e=t.parentNode;e.insertBefore(this.endNode,t),e.insertBefore(this.startNode,this.endNode)},t.prototype.setValueIndex=function(t){this._valueIndex=t},t.prototype.appendIntoPart=function(t){t._insert(this.startNode=r.createMarker()),t._insert(this.endNode=r.createMarker())},t.prototype.insertAfterPart=function(t){var e=r.createMarker();t._insert(e),this.endNode=t.endNode,t.endNode=e,this._insert(this.startNode=r.createMarker())},t.prototype.setValue=function(t){var e,o;o=(e=null!=this._valueIndex?t[this._valueIndex]:t)instanceof s.TemplateResult?n.TemplateResult:Array.isArray(e)?n.ArrayResult:e instanceof Node?n.Node:n.NodeValue,this._valueType!==n.None&&this._valueType!==o&&this._clear(),this._valueType=o;var r=this._valueHandleMap[this._valueType];r&&r(e),this._pendingValue=e},t.prototype.destroy=function(){switch(this._valueType){case n.TemplateResult:this.value._destroy();break;case n.ArrayResult:this.value.forEach(function(t){t.destroy()})}this.value=null,i.removeAllNodes(this.startNode.parentNode,this.startNode,this.endNode),this.startNode=null,this.endNode=null},t.prototype._clearDOM=function(t){void 0===t&&(t=this.startNode),i.removeNodes(this.startNode.parentNode,t.nextSibling,this.endNode)},t.prototype._clear=function(){switch(this._valueType){case n.TemplateResult:this.value._destroy();break;case n.ArrayResult:this.value.forEach(function(t){t.destroy()})}this.value=null,this._clearDOM(this.startNode)},t.prototype._insert=function(t){this.endNode.parentNode.insertBefore(t,this.endNode)},t.prototype._setTemplateResultValue=function(t){if(this.value&&this.value.isSameTemplate(t))this.value.setValue(t);else{this.value&&this.value._destroy(),this._clearDOM();var e=new a.TemplateInstance(this.options);e.setValue(t),this._insert(e.fragment),this.value=e}},t.prototype._commitTemplateResult=function(){this.value.commit()},t.prototype._setIterableValue=function(e){for(var n,o=this.value||[],r=0,i=0,s=e;i<s.length;i++){var a=s[i];void 0===(n=o[r])&&(n=new t(this.options),o[r]=n,0===r?n.appendIntoPart(this):n.insertAfterPart(o[r-1])),n.setValue(a),r++}this.value=o;var p=o.length;if(r<p){n=o[r];for(var u=r;u<p;u++){var l=o[u];l&&l.destroy()}o.length=r}},t.prototype._commitIterable=function(){for(var t=0,e=this.value||[];t<e.length;t++){e[t].commit()}},t.prototype._commitNode=function(t){this.value!==t&&(this._clearDOM(),this._insert(t),this.value=t)},t.prototype._commitText=function(t){if(t=null==t?"":t,this.value){if(this._textValue===t)return;this.value.nodeValue=t,this._textValue=t}else this.value=document.createTextNode("string"==typeof t?t:String(t)),this._insert(this.value),this._textValue=t},t.prototype.commit=function(){var t=this._pendingValue;switch(this._valueType){case n.TemplateResult:return this._commitTemplateResult();case n.ArrayResult:return this._commitIterable();case n.NodeValue:return this._commitText(t);case n.Node:return this._commitNode(t)}},t}();e.NodePart=p});n(p);p.ComponentPart,p.NodePart;var u=o(function(t,e){Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(){this._cache={}}return t.prototype._each=function(t){var e=this._cache;Object.keys(e).forEach(function(n){t(n,e[n])})},t.prototype.clear=function(){this._cache={}},t.prototype.has=function(t){return this._cache.hasOwnProperty(t)},t.prototype.get=function(t){return this._cache[t]},t.prototype.set=function(t,e){this._cache[t]=e},Object.defineProperty(t.prototype,"size",{get:function(){return Object.keys(this._cache).length},enumerable:!0,configurable:!0}),t}();e.default=n});n(u);var l=o(function(t,e){Object.defineProperty(e,"__esModule",{value:!0});var n=[],o=new u.default,r={isInBatchUpdating:!1,isInClosingUpdating:!1,performUpdate:function(t){var e=t.instance,n=Object.assign({},e.state||{},t.partialState),o=e.constructor.getDerivedStateFromProps;if(o){var r=o.call(e.constructor,e._pendProps,n);r&&(n=Object.assign({},n,r))}if(!e._mountFlag)return e.state=n,void e._firstCommit();if(e.shouldComponentUpdate(e._pendProps,n)){var i=e.props,s=e.state;e.props=e._pendProps,e.state=n;var a=void 0;e.getSnapshotBeforeUpdate&&(a=e.getSnapshotBeforeUpdate(i,s)),e._commit(i,s,a)}else e.props=e._pendProps,e.state=n},enqueueSetState:function(t,e,i,s){if(!r.isInBatchUpdating||s)r.performUpdate({instance:t,partialState:e}),i&&i();else{var a=o.get(t.id);if(a){if(a.flushed)return;a.partialState=Object.assign({},a.partialState,e),i&&n.push(i)}else{var p={partialState:e,instance:t,flushed:!1};if(r.isInClosingUpdating)return r.performUpdate(p),void(i&&i());o.set(t.id,p),i&&n.push(i)}}},closeBatchUpdating:function(){r.isInClosingUpdating=!0,o._each(function(t,e){r.performUpdate(e),e.flushed=!0}),o.clear(),r.isInClosingUpdating=!1,r.isInBatchUpdating=!1;for(var t=n.length,e=0;e<t;e++)n[e]();n.splice(0,t)}};e.default=r});n(l);var c=o(function(t,n){var o,r,i=e&&e.__extends||(o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});function s(t,e,n){for(var o="",r=e.length-1,i=0;i<r;i++)o+=e[i]+n[t+i];return o+=e[r]}Object.defineProperty(n,"__esModule",{value:!0}),function(t){t[t.Attribute=0]="Attribute",t[t.Property=1]="Property",t[t.Content=2]="Content",t[t.Event=3]="Event",t[t.BooleanAttribute=4]="BooleanAttribute"}(r=n.PeonType||(n.PeonType={}));var a=function(){function t(t){this._shouldUpdate=!1,this.startIndex=t.startIndex,this.name=t.name,this.node=t.node,this.strings=t.strings}return t.prototype.setValue=function(t){var e=s(this.startIndex,this.strings,t);e!==this._pendingValue&&(this._shouldUpdate=!0),this._pendingValue=e},t.prototype.commit=function(){this._shouldUpdate&&(this.node.setAttribute(this.name,this._pendingValue),this._shouldUpdate=!1)},t.prototype.destroy=function(){},t}(),p=function(){function t(t){this._shouldUpdate=!1,this.startIndex=t.startIndex,this.node=t.node,this.strings=t.strings}return t.prototype.setValue=function(t){s(this.startIndex,this.strings,t)!==this._pendingValue&&(this._shouldUpdate=!0),this._pendingValue=s(this.startIndex,this.strings,t)},t.prototype.destroy=function(){},t.prototype.commit=function(){this._shouldUpdate&&(this.node.nodeValue=this._pendingValue,this._shouldUpdate=!1)},t}(),u=!1;try{var c={get capture(){return u=!0,!1}};window.addEventListener("test",c,c),window.removeEventListener("test",c,c)}catch(t){}var h=function(){function t(t){var e=this;this.value=void 0,this._pendingValue=void 0,this.node=t.node,this.name=t.name,this.notInWebComponent=t.notInWebComponent,this.startIndex=t.startIndex,this.eventContext=t.eventContext,this._boundHandleEvent=function(t){return e.handleEvent(t)}}return t.getOptions=function(t){return t&&(u?{capture:t.capture,passive:t.passive,once:t.once}:t.capture)},t.prototype.setValue=function(t){this._pendingValue=t[this.startIndex]},t.prototype.destroy=function(){this.node&&this.node.removeEventListener(this.name,this._boundHandleEvent,this._options)},t.prototype.commit=function(){var e=this._pendingValue,n=this.value,o=this.node,r=null==e||null!=n&&(e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive),i=null!=e&&(null==n||r);r&&o.removeEventListener(this.name,this._boundHandleEvent,this._options),i&&(this._options=t.getOptions(e),o.addEventListener(this.name,this._boundHandleEvent,this._options)),this.value=e},t.prototype.handleEvent=function(t){this.notInWebComponent&&(l.default.isInBatchUpdating=!0),"function"==typeof this.value?this.value.call(this.eventContext||this.node,t):this.value.handleEvent(t),this.notInWebComponent&&l.default.closeBatchUpdating()},t}(),d=function(t){function e(e){var n=t.call(this,e)||this;if(2!==n.strings.length||""!==n.strings[0]||""!==n.strings[1])throw new Error("Boolean attributes can only contain a single expression");return n}return i(e,t),e.prototype.setValue=function(t){var e=t[this.startIndex];e!==this._pendingValue&&(this._shouldUpdate=!0),this._pendingValue=e},e.prototype.commit=function(){this._shouldUpdate&&(this._pendingValue?this.node.setAttribute(this.name,""):this.node.removeAttribute(this.name),this._shouldUpdate=!1)},e}(a),f=function(t){function e(e){var n=t.call(this,e)||this;return n.single=2===n.strings.length&&""===n.strings[0]&&""===n.strings[1],n}return i(e,t),e.prototype.setValue=function(t){var e;(e=this.single?t[this.startIndex]:s(this.startIndex,this.strings,t))!==this._pendingValue&&(this._shouldUpdate=!0),this._pendingValue=e},e.prototype.commit=function(){this._shouldUpdate&&(this.node[this.name]=this._pendingValue,this._shouldUpdate=!1)},e}(a);n.createPeon=function(t,e){switch(t){case r.Attribute:return new a(e);case r.Content:return new p(e);case r.Event:return new h(e);case r.Property:return new f(e);case r.BooleanAttribute:return new d(e)}}});n(c);c.PeonType,c.createPeon;var h=o(function(t,e){Object.defineProperty(e,"__esModule",{value:!0});var n=new Map;e.defineComponent=function(t,e){n.set(t,e)},e.getCom=function(t){return n.get(t)}});n(h);h.defineComponent,h.getCom;var d=o(function(t,e){Object.defineProperty(e,"__esModule",{value:!0}),e.DEFAULT_SLOT_NAME="@slot@"});n(d);d.DEFAULT_SLOT_NAME;var f=o(function(t,e){function n(t){return t.slice(1)}Object.defineProperty(e,"__esModule",{value:!0});var o={"@":{type:c.PeonType.Event,getName:n},".":{type:c.PeonType.Property,getName:n},"?":{type:c.PeonType.BooleanAttribute,getName:n}},s={type:c.PeonType.Attribute,getName:function(t){return t}};function a(t,e,n,a,p){if(t.hasAttributes()){for(var u=[],l=t.attributes,c=0;c<l.length;c++){var h=l[c];if(h.value.indexOf(r.marker)>=0){var d=n.strings[e],f=r.matchLastAttributeName(d)[2],v=f.toLowerCase()+r.boundAttributeSuffix,m=t.getAttribute(v).split(r.markerRegex);u.push(v);var _=f[0];a(f,o[_]||s,e,m),e+=m.length-1}else p&&p(h)}u.length>0&&i.removeAttributes(t,u)}return e}var u={1:function(t,e,n,o){var r=t.localName,i=h.getCom(r);return i?function(t,e,n,o,r){var i=r.templateResult,s=r.renderOption,u=[];n=a(e,n,i,function(t,e,n){u.push({name:e.getName(t),index:n})},function(t){u.push({name:t.localName,value:t.value})});var c={};if(e.children.length>0){for(var h=[],f=document.createDocumentFragment();e.children.length>0;){var v=e.children[0],m=v.getAttribute("slot");m?c[m]=[v]:h.push(v),f.appendChild(v)}var _=l(f,i,n,s);n=_.partIndex,_.peons.length&&o.push.apply(o,_.peons),h.length>0&&(c[d.DEFAULT_SLOT_NAME]=h)}var y=new p.ComponentPart(t,u,c,r.renderOption);return y.insertBeforeNode(e),o.push(y),{partIndex:n,nodesToRemove:[e]}}(i,t,e,n,o):o.renderOption.slots&&"slot"===r?function(t,e,n,o){var r=o.renderOption,i=[t],s=t.getAttribute("name")||d.DEFAULT_SLOT_NAME,a=r.slots[s];if(a&&a.length>0)for(var p=a.length,u=t.parentNode,l=0;l<p;l++)u.insertBefore(a[l],t);return{partIndex:e,nodesToRemove:i}}(t,e,0,o):function(t,e,n,o){var r=o.templateResult,i=o.renderOption;return{partIndex:e=a(t,e,r,function(e,r,s,a){n.push(c.createPeon(r.type,{startIndex:s,strings:a,notInWebComponent:i.notInWebComponent,name:r.getName(e),eventContext:o.renderOption?o.renderOption.eventContext:null,node:t}))})}}(t,e,n,o)},3:function(t,e,n,o){var i=o.renderOption,s=t.nodeValue;if(s&&s.indexOf(r.marker)>=0){var a=s.split(r.markerRegex);n.push(c.createPeon(c.PeonType.Content,{startIndex:e,notInWebComponent:i.notInWebComponent,strings:a,node:t})),e+=a.length-1}return{partIndex:e}},8:function(t,e,n,o){var i=o.renderOption,s=[];if(t.nodeValue===r.marker){var a=new p.NodePart(i);a.setValueIndex(e),a.attachNode(t),n.push(a),e+=1,s.push(t)}return{partIndex:e,nodesToRemove:s}}};function l(t,e,n,o){for(var r=[],i=document.createTreeWalker(t,133,null,!1),s=[];i.nextNode();){var a=i.currentNode,p=u[a.nodeType];if(p){var l=p(a,n,r,{templateResult:e,renderOption:o});n=l.partIndex,l.nodesToRemove&&(s=s.concat(l.nodesToRemove))}}for(var c=0,h=s;c<h.length;c++){var d=h[c];d.parentNode.removeChild(d)}return{fragment:t,partIndex:n,peons:r}}e.walkNode=l;var f=new Map;e.default=function(t,e){return l(e.templateClone(function(t){var e=f.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},f.set(t.type,e));var n=e.stringsArray.get(t.strings);if(void 0!==n)return n;var o=t.strings.join(r.marker);return void 0===(n=e.keyString.get(o))&&(n=t.getTemplateElement(),e.keyString.set(o,n)),e.stringsArray.set(t.strings,n),n}(t)),t,0,e)}});n(f);f.walkNode;var v=o(function(t,n){var o=e&&e.__assign||function(){return(o=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var r in e=arguments[n])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t}).apply(this,arguments)};Object.defineProperty(n,"__esModule",{value:!0});var r=new WeakMap;function s(t,e,n){var s=r.get(e);return void 0===s&&(i.removeNodes(e,e.firstChild),r.set(e,s=new p.NodePart(o({templateProcessor:f.default,templateClone:i.clone},n))),s.appendInto(e)),s.setValue(t),s.commit(),s}n.shadowRender=s,n.render=function(t,e,n){return s(t,e,o({},n,{notInWebComponent:!0}))}});n(v);v.shadowRender,v.render;var m=o(function(t,n){var o,r=e&&e.__extends||(o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),i=e&&e.__awaiter||function(t,e,n,o){return new(n||(n=Promise))(function(r,i){function s(t){try{p(o.next(t))}catch(t){i(t)}}function a(t){try{p(o.throw(t))}catch(t){i(t)}}function p(t){t.done?r(t.value):new n(function(e){e(t.value)}).then(s,a)}p((o=o.apply(t,e||[])).next())})},s=e&&e.__generator||function(t,e){var n,o,r,i,s={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;s;)try{if(n=1,o&&(r=2&i[0]?o.return:i[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,i[1])).done)return r;switch(o=0,r&&(i=[2&i[0],r.value]),i[0]){case 0:case 1:r=i;break;case 4:return s.label++,{value:i[1],done:!1};case 5:s.label++,o=i[1],i=[0];continue;case 7:i=s.ops.pop(),s.trys.pop();continue;default:if(!(r=(r=s.trys).length>0&&r[r.length-1])&&(6===i[0]||2===i[0])){s=0;continue}if(3===i[0]&&(!r||i[1]>r[0]&&i[1]<r[3])){s.label=i[1];break}if(6===i[0]&&s.label<r[1]){s.label=r[1],r=i;break}if(r&&s.label<r[2]){s.label=r[2],s.ops.push(i);break}r[2]&&s.ops.pop(),s.trys.pop();continue}i=e.call(t,s)}catch(t){i=[6,t],o=0}finally{n=r=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,a])}}};Object.defineProperty(n,"__esModule",{value:!0});var a={toAttribute:function(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute:function(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}};n.notEqual=function(t,e){return e!==t&&(e==e||t==t)};var p={attribute:!0,type:String,converter:a,reflect:!1,hasChanged:n.notEqual},l=function(t){function e(){var e=t.call(this)||this;return e._reflectingProperties=void 0,e._pendProps={},e._updatePromise=Promise.resolve(!0),e._stateFlags=0,e.__props={},e.initialize(),e}return r(e,t),e._propertyValueFromAttribute=function(t,e){var n=e.type,o=e.converter||a,r="function"==typeof o?o:o.fromAttribute;return r?r(t,n):t},e._attributeNameForProperty=function(t,e){var n=e.attribute;return!1===n?void 0:"string"==typeof n?n:"string"==typeof t?t.toLowerCase():void 0},e._propertyValueToAttribute=function(t,e){if(void 0!==e.reflect){var n=e.type,o=e.converter;return(o&&o.toAttribute||a.toAttribute)(t,n)}},Object.defineProperty(e,"observedAttributes",{get:function(){var t=this;this._finalize();var e=[];return this._classProperties&&this._classProperties._each(function(n,o){var r=t._attributeNameForProperty(n,o);void 0!==r&&(t._attributeToPropertyMap.set(r,n),e.push(r))}),e},enumerable:!0,configurable:!0}),e._finalize=function(){if(!this.hasOwnProperty("_finalized")||!this._finalized){var t=Object.getPrototypeOf(this);if("function"==typeof t._finalize&&t._finalize(),this._finalized=!0,this._attributeToPropertyMap=new u.default,this.hasOwnProperty("properties"))for(var e=this.properties,n=0,o=Object.getOwnPropertyNames(e).concat("function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e):[]);n<o.length;n++){var r=o[n];this.createProperty(r,e[r])}}},Object.defineProperty(e.prototype,"props",{get:function(){return this.__props},set:function(t){},enumerable:!0,configurable:!0}),e.createProperty=function(t,e){var n=this;if(void 0===e&&(e=p),!this.hasOwnProperty("_classProperties")){this._classProperties=new u.default;var o=Object.getPrototypeOf(this)._classProperties;void 0!==o&&o.forEach(function(t,e){return n._classProperties.set(e,t)})}if(this._classProperties.set(t,e),!e.noAccessor){var r="symbol"==typeof t?Symbol():"__"+t;Object.defineProperty(this.prototype,t,{get:function(){return this[r]},set:function(e){var n=this[r];this[r]=e,this.requestUpdate(t,n)},configurable:!0,enumerable:!0})}},e.prototype._markFlag=function(t){this._stateFlags=this._stateFlags|t},e.prototype._clearFlag=function(t){this._stateFlags=this._stateFlags&~t},e.prototype._hasFlag=function(t){return this._stateFlags&t},e.prototype.initialize=function(){this.attachShadow({mode:"open"}),this.requestUpdate()},e.prototype.requestUpdate=function(t,e,o){var r=!0;if(void 0!==t&&!this._pendProps.hasOwnProperty(t)){var i=this.constructor._classProperties.get(t)||p;(i.hasChanged||n.notEqual)(this[t],e)?(this._pendProps[t]=this[t],!0!==i.reflect||this._hasFlag(16)||(void 0===this._reflectingProperties&&(this._reflectingProperties=new u.default),this._reflectingProperties.set(t,i))):r=!1}!this._hasFlag(1)&&r?this._enqueueUpdate(o):o&&o()},e.prototype.__updateThisProps=function(){this.__props=Object.assign({},this.props,this._pendProps),Object.freeze(this.__props)},e.prototype.performUpdate=function(){var t=Object.assign({},this.state||{},this._alternalState||{}),e=this.constructor.getDerivedStateFromProps;if(e){var n=e.call(this.constructor,this._pendProps,t);n&&(t=Object.assign({},t,n))}if(this._hasFlag(4))if(this.shouldComponentUpdate(this._pendProps,t)){var o=this.props,r=this.state;this.__updateThisProps(),this.state=t;var i=void 0;this.getSnapshotBeforeUpdate&&(i=this.getSnapshotBeforeUpdate(o,r)),this.update(),this.componentDidUpdate(o,r,i)}else this.__updateThisProps(),this.state=t;else this.__updateThisProps(),this.state=t,this.componentWillMount(),this.update(),this._markFlag(4),this.componentDidMount();this._markUpdated()},e.prototype._markUpdated=function(){this._pendProps={},this._clearFlag(1),this._alternalState=null},e.prototype._enqueueUpdate=function(t){return i(this,void 0,void 0,function(){var e,n,o;return s(this,function(r){switch(r.label){case 0:return this._markFlag(1),n=this._updatePromise,this._updatePromise=new Promise(function(t){return e=t}),[4,n];case 1:return r.sent(),null==(o=this.performUpdate())||"function"!=typeof o.then?[3,3]:[4,o];case 2:r.sent(),r.label=3;case 3:return t&&t(),e(!0),[2]}})})},e.prototype.update=function(){var t=this;try{void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties._each(function(e,n){t._propertyToAttribute(e,t[e],n)}),this._reflectingProperties=void 0),this.__part=v.shadowRender(this.render(),this.shadowRoot,{eventContext:this})}catch(t){if(!this.componentDidCatch)throw new Error(t);this.componentDidCatch(t)}},e.prototype._propertyToAttribute=function(t,e,n){void 0===n&&(n=p);var o=this.constructor,r=o._attributeNameForProperty(t,n);if(void 0!==r){var i=o._propertyValueToAttribute(e,n);if(void 0===i)return;this._markFlag(8),null==i?this.removeAttribute(r):this.setAttribute(r,i),this._clearFlag(8)}},e.prototype._attributeToProperty=function(t,e){if(!this._hasFlag(8)){var n=this.constructor;if(null!=n._attributeToPropertyMap){var o=n._attributeToPropertyMap.get(t);if(void 0!==o){var r=n._classProperties.get(o)||p;this._markFlag(16),this[o]=n._propertyValueFromAttribute(e,r),this._clearFlag(16)}}}},e.prototype.attributeChangedCallback=function(t,e,n){e!==n&&this._attributeToProperty(t,n)},e.prototype.disconnectedCallback=function(){this.componentWillUnmount(),this.__part&&this.__part.destroy()},e.prototype.componentWillReceiveProps=function(t){},e.prototype.componentDidMount=function(){},e.prototype.componentDidUpdate=function(t,e,n){},e.prototype.componentWillUnmount=function(){},e.prototype.componentWillMount=function(){},e.prototype.shouldComponentUpdate=function(t,e){return!0},e.prototype.forceUpdate=function(t){this.setState(null,t)},e.prototype.setState=function(t,e){t&&(this._alternalState=Object.assign({},this._alternalState,t)),this.requestUpdate(void 0,void 0,e)},e._finalized=!0,e.properties={},e}(HTMLElement);n.WebComponent=l,n.defineWebComponent=function(t,e){customElements.define(t,e)};var c={props:!0,state:!0};n.property=function(t){return function(e,n){c[n]||e.constructor.createProperty(n,t)}}});n(m);m.notEqual,m.WebComponent,m.defineWebComponent,m.property;var _=o(function(t,n){var o=e&&e.__assign||function(){return(o=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var r in e=arguments[n])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t}).apply(this,arguments)};Object.defineProperty(n,"__esModule",{value:!0});var r=1,i=function(){function t(t){this._mountFlag=!1,this.props=t,this.id=""+r++}return t.prototype.componentWillReceiveProps=function(t){},t.prototype.shouldComponentUpdate=function(t,e){return!0},t.prototype.componentDidMount=function(){},t.prototype.componentDidUpdate=function(t,e,n){},t.prototype.componentWillUnmount=function(){},t.prototype.componentWillMount=function(){},t.prototype._doRender=function(){try{this.part=v.render(this.render(),this.fragment,o({},this.renderOption,{eventContext:this,slots:this._slots}))}catch(t){if(!this.componentDidCatch)throw new Error(t);this.componentDidCatch(t)}},t.prototype._firstCommit=function(){this._doRender(),this._mount(this.fragment),this._mountFlag=!0,this.componentDidMount()},t.prototype._commit=function(t,e,n){this._doRender(),this.componentDidUpdate(t,e,n)},t.prototype.forceUpdate=function(t){l.default.enqueueSetState(this,null,t,!0)},t.prototype.setState=function(t,e){l.default.enqueueSetState(this,t||{},e,!1)},t}();n.Component=i});n(_);_.Component;var y=o(function(t,e){Object.defineProperty(e,"__esModule",{value:!0}),e.defineWebComponent=m.defineWebComponent,e.WebComponent=m.WebComponent,e.property=m.property,e.Component=_.Component,e.defineComponent=h.defineComponent,e.render=v.shadowRender,e.html=function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];return new s.TemplateResult(t,e,"html")},e.svg=function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];return new s.SVGTemplateResult(t,e,"svg")}}),g=n(y),b=y.defineWebComponent,P=y.WebComponent,x=y.property,N=y.Component,O=y.defineComponent,C=y.render,w=y.html,T=y.svg;t.default=g,t.defineWebComponent=b,t.WebComponent=P,t.property=x,t.Component=N,t.defineComponent=O,t.render=C,t.html=w,t.svg=T,Object.defineProperty(t,"__esModule",{value:!0})});
