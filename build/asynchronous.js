/**
*
*   Asynchronous.js
*   @version: 0.5.0
*
*   Simple JavaScript class to manage asynchronous, parallel, linear, sequential and interleaved tasks
*   https://github.com/foo123/asynchronous.js
*
**/
!function(n,e,t){"use strict";"undefined"!=typeof Components&&"object"==typeof Components.classes&&"object"==typeof Components.classesByID&&Components.utils&&"function"==typeof Components.utils["import"]?(n.$deps=n.$deps||{})&&(n.EXPORTED_SYMBOLS=[e])&&(n[e]=n.$deps[e]=t.call(n)):"object"==typeof module&&module.exports?(module.$deps=module.$deps||{})&&(module.exports=module.$deps[e]=t.call(n)):"undefined"!=typeof System&&"function"==typeof System.register&&"function"==typeof System["import"]?System.register(e,[],function(r){r(e,t.call(n))}):"function"==typeof define&&define.amd&&"function"==typeof require&&"function"==typeof require.specified&&require.specified(e)?define(e,["module"],function(e){return t.moduleUri=e.uri,t.call(n)}):e in n||(n[e]=t.call(n)||1)&&"function"==typeof define&&define.amd&&define(function(){return n[e]})}(this,"Asynchronous",function n(e){"use strict";function t(n){var e,t=[];if(n)for(e in n)n[c](e)&&t.push(e+"="+(!0===n[e]||1===n[e]?"yes":!1===n[e]||0===n[e]?"no":n[e]));return t.join(",")}function r(n,e){n.$runmode=M,n.$running=!1}function o(n,e){var t,r=n,o=r.$queue;if(r.$runmode=x,o){for(;o.length&&(!o[0]||!o[0].canRun());)o.shift();o.length?(r.$running=!0,t=o.shift(),e?t.runWithArgs(e):t.run(),t.complete()):r.$running=!1}}function i(n,e){var t,r=n,o=r.$queue,s=0;if(r.$runmode=R,o&&o.length){for(r.$running=!0;s<o.length;)t=o[s],t&&t.canRun()?(e?t.runWithArgs(e):t.run(),t.isFinished()?(o.shift(),t.complete()):s++):o.shift();r.$running=!1,r.$timer=N(v(i,r),r.$interval)}}function s(n,e){var t,r=n,o=r.$queue;r.$runmode=O,o&&o.length&&(t=o[0],t&&t.canRun()?(r.$running=!0,e?t.runWithArgs(e):t.run(),t.isFinished()&&(o.shift(),t.complete())):o.shift(),r.$running=!1,r.$timer=N(v(s,r),r.$interval))}var u,l="prototype",c="hasOwnProperty",a=Object,f=Array,p=Function,d=p[l],h=a[l],m=f[l],$=(JSON.parse,JSON.stringify),g=function(){},v=function(n,e){return function(){return n(e)}},w=d.call.bind(m.slice),y=h.toString,b=function(n){return"function"==typeof n},S=function(n,e){return n instanceof e},N=setTimeout,k=clearTimeout,j=e,E=0,T=1,q=2,W=60,A=0,R=1,x=2,M=3,O=4,C="undefined"!=typeof Components&&"object"==typeof Components.classes&&"object"==typeof Components.classesByID&&Components.utils&&"function"==typeof Components.utils["import"],L="undefined"!=typeof global&&"[object global]"===y.call(global),I=L&&"undefined"!=typeof process.send,U=!C&&!L&&"undefined"!=typeof SharedWorkerGlobalScope&&"function"==typeof importScripts,B=!C&&!L&&"undefined"!=typeof WorkerGlobalScope&&"function"==typeof importScripts&&navigator instanceof WorkerNavigator,D=!(C||L||B||U||"undefined"==typeof navigator||"undefined"==typeof document),F=(D&&!!window.opener,D&&window.self!==window.top,"function"==typeof define&&define.amd),P=L||"function"==typeof Worker||"function"==typeof SharedWorker,_=I||U||B,z=_?function sn(n){sn.handler&&sn.handler(I?n:n.data)}:g,G=L?this:U||B?self:window||this,J=L?module.$deps:U||B?self:window||this,V=(L?global:U||B?self:window||this,null),K=(L?require("os").cpus().length:4,L?null:"undefined"!=typeof G.webkitURL?G.webkitURL:"undefined"!=typeof G.URL?G.URL:null),Q=function(n,e){return n&&K?K.createObjectURL(new Blob(n.push?n:[n],e||{type:"text/javascript"})):n},X=function un(n){var e;return L?{file:__filename,path:__dirname}:U||B?{file:e=self.location.href,path:e.split("/").slice(0,-1).join("/")}:F&&n?{file:e=n,path:e.split("/").slice(0,-1).join("/")}:D&&(e=document.getElementsByTagName("script"))&&e.length?(un.link||(un.link=document.createElement("a")),un.link.href=e[e.length-1].src,e=un.link.href,{file:e,path:e.split("/").slice(0,-1).join("/")}):{path:null,file:null}},Y=X(n.moduleUri),H=Y.file,Z=function(n){return!(!n||!n.length||n===H)},nn=function(n,e){if(n=n||{},e)for(var t in e)e[c](t)&&(n[t]=e[t]);return n},en=0;L?(u=function(n){var e=this;e.process=require("child_process").fork(n),e.process.on("message",function(n){e.onmessage&&e.onmessage(n)}),e.process.on("error",function(n){e.onerror&&e.onerror(n)})},u.Shared=u,u[l]={constructor:u,process:null,onmessage:null,onerror:null,postMessage:function(n){return this.process&&this.process.send(n),this},terminate:function(){return this.process&&(this.process.kill(),this.process=null),this}}):(u=function(n){var e=this;e.process=new Worker(n),e.process.onmessage=function(n){e.onmessage&&e.onmessage(n.data)},e.process.onerror=function(n){e.onerror&&e.onerror(n)}},u.Shared=u,u[l]={constructor:u,process:null,onmessage:null,onerror:null,postMessage:function(n){return this.process&&this.process.postMessage(n),this},terminate:function(){return this.process&&(this.process.terminate(),this.process=null),this}},"function"==typeof SharedWorker&&(u.Shared=function(n){var e=this;e.process=new SharedWorker(n),e.process.port.start(),e.process.port.onmessage=function(n){e.onmessage&&e.onmessage(n.data)},e.process.port.onerror=e.process.onerror=function(n){e.onerror&&e.onerror(n)}},u.Shared[l]={constructor:u.Shared,process:null,onmessage:null,onerror:null,postMessage:function(n){return this.process&&this.process.port.postMessage(n),this},terminate:function(){return this.process&&(this.process.port.close(),this.process=null),this}})),U?(G.close=g,G.postMessage=g,G.onconnect=function(n){var e=n.ports[0];G.close=function(){e.close()},G.postMessage=function(n){e.postMessage(n)},e.addEventListener("message",z),e.start()}):B?G.onmessage=z:I&&(G.close=function(){process.exit()},G.postMessage=function(n){process.send(n)},G.importScripts=function(n){if(n&&(n=n.split(",")).length)for(var e,t=0,r=require("fs");t<n.length;){e=!0;try{new Function("",r.readFileSync(n[t]).toString()).call(J)}catch(o){e=o}if(!0!==e)throw e;t++}},process.on("message",z));var tn=function ln(n){var e=this;return e instanceof ln?(e.$id=(++en).toString(16),void(e.options=nn({width:400,height:400,toolbar:0,location:0,directories:0,status:0,menubar:0,scrollbars:1,resizable:1},n))):new ln(n)};tn[l]={constructor:tn,options:null,$id:null,$window:null,dispose:function(){var n=this;return n.$window&&n.close(),n.$window=null,n.$id=null,n.options=null,n},close:function(){var n=this;return n.$window&&(n.$window.closed||n.$window.close(),n.$window=null),n},ready:function(n,e){var t=this,r=function o(){!t.$window||n&&!t.$window[n]?setTimeout(o,50):e()};return setTimeout(r,0),t},open:function(n){var e=this;return!e.$window&&n&&(e.$window=window.open(n.push?Q(["\ufeff"].concat(n),{type:"text/html;charset=utf-8"}):n,e.$id,t(e.options))),e},write:function(n){var e=this;return e.$window&&n&&e.$window.document.write(n),e}};var rn=function cn(n){if(n instanceof cn)return n;if(!(this instanceof cn))return new cn(n);var t,r=this,o=null,i=null,s=null,u=!1,l=!1,c=!1,a=!1,f=!1,p=!1,d=null,h=0,m=1,$=null,g=null,v=null,w=e;r.queue=function(n){return arguments.length?(o=n,r):o},r.jumpNext=function(n){o&&o.jumpNext(!1,n)},r.abort=function(n){o&&(o.abort(!1),n&&(o.dispose(),o=null))},r.dispose=function(){o&&(o.dispose(),o=null)},r.task=function(n){return i=n,r},n&&r.task(n),r.run=t=function(){return i.jumpNext=r.jumpNext,i.abort=r.abort,i.dispose=r.dispose,w=i(),u=!0,i.jumpNext=null,i.abort=null,i.dispose=null,w},r.runWithArgs=function(n){return i.jumpNext=r.jumpNext,i.abort=r.abort,i.dispose=r.dispose,w=i.apply(null,n),u=!0,i.jumpNext=null,i.abort=null,i.dispose=null,w},r.canRun=function(){return i&&(!u||l||c||a||f||p)?(l||c)&&h>=$?!1:c&&!d?!1:!a&&!f||w!==g:!1},r.iif=function(n,e,t){return n?r.task(e):arguments.length>2&&r.task(t),r},r.until=function(n){return w=e,d=null,g=n,f=!0,p=!1,l=!1,c=!1,a=!1,r.run=t,r},r.untilNot=function(n){return w=e,d=null,v=n,p=!0,f=!1,l=!1,c=!1,a=!1,r.run=t,r},r.loop=function(n,t,o){return w=e,d=null,h=t||0,m=o||1,$=n,l=!0,f=!1,p=!1,c=!1,a=!1,r.run=function(){var n;return n=i(h),h+=m,w=n,u=!0,n},r},r.each=function(n){return w=e,d=n,h=0,m=1,$=n?n.length||0:0,c=!0,f=!1,p=!1,l=!1,a=!1,r.run=function(){var n;return n=i(d[h],h),h++,w=n,u=!0,n},r},r.recurse=function(n,e){return d=null,w=n,g=e,a=!0,f=!1,p=!1,l=!1,c=!1,r.run=function(){var n;return n=i(w),w=n,u=!0,n},r},r.isFinished=function(){var n=!u||p||f||l||c||a;return n&&(f||a)&&w===g&&(n=!1),n&&p&&w!==v&&(n=!1),n&&(l||c)&&h>=$&&(n=!1),!n},r.onComplete=function(n){return s=n||null,r},r.complete=function(){return s&&b(s)&&s(),r}},on=function an(n,e){if(S(n,rn))return n;if(b(n))return new rn(n);if(!S(this,an))return new an(n,e);var t=this;t.$interval=arguments.length?parseInt(n,10)||W:W,t.$timer=null,t.$runmode=A,t.$running=!1,t.$queue=[],_&&!1!==e&&t.initThread()};return on.VERSION="0.5.0",on.Thread=u,on.Task=rn,on.BrowserWindow=tn,on.MODE={NONE:A,INTERLEAVE:R,LINEAR:x,PARALLEL:M,SEQUENCE:O},on.Platform={UNDEFINED:j,UNKNOWN:E,NODE:T,BROWSER:q},on.supportsMultiThreading=function(){return P},on.isPlatform=function(n){return T===n?L:q===n?D:e},on.isThread=function(n){return T===n?I:q===n?U||B:_},on.path=X,on.blob=Q,on.load=function(n,e,t){if(n){var r=function(){n=n.split(".");for(var e=J;n.length;)n[0]&&n[0].length&&e[n[0]]&&(e=e[n[0]]),n.shift();return e&&G!==e?b(e)?!1!==t?new e:e():e:void 0};return e&&e.length&&(e=e.filter(Z),e.length&&on.importScripts(e.join(","))),r()}return null},on.listen=_?function(n){z.handler=n}:g,on.send=_?function(n){G.postMessage(n)}:g,on.importScripts=_?function(n){G.importScripts(n)}:g,on.close=_?function(){G.close()}:g,on.log="undefined"!=typeof console?function(n){console.log(n||"")}:g,on.serialize=function(n){n=n||new on;var e=function(e){var t=function(){var t=this,r=arguments;n.step(function(){e.apply(t,r)}),n.$running||n.run(x)};return t.free=function(){return e},t};return e.free=function(){n&&n.dispose(),n=null},e},on[l]={constructor:on,$interval:W,$timer:null,$queue:null,$thread:null,$events:null,$runmode:A,$running:!1,dispose:function(n){var e=this;return e.unfork(!0),e.$timer&&k(e.$timer),e.$thread=null,e.$timer=null,e.$interval=null,e.$queue=null,e.$runmode=A,e.$running=!1,_&&!0===n&&on.close(),e},empty:function(){var n=this;return n.$timer&&k(n.$timer),n.$timer=null,n.$queue=[],n.$runmode=A,n.$running=!1,n},interval:function(n){return arguments.length?(this.$interval=parseInt(n,10)||this.$interval,this):this.$interval},fork:function(n,e,t,r){var o,i,s,l=this;if(!l.$thread){if(!P)throw l.$thread=null,new Error("Asynchronous: Multi-Threading is NOT supported!");L?(i="Asynchronous: Thread (Process): ",s="Asynchronous: Thread (Process) Error: "):(i="Asynchronous: Thread (Worker): ",s="Asynchronous: Thread (Worker) Error: "),l.$events=l.$events||{},o=l.$thread=!0===r?new u.Shared(H):new u(H),o.onmessage=function(n){if(n.event){var e=n.event,t=n.data||null;l.$events&&l.$events[e]?l.$events[e](t):"console.log"!==e&&"console.error"!==e||on.log(("console.error"===e?s:i)+(t||""))}},o.onerror=function(n){if(!l.$events||!l.$events.error)throw new Error(s+n.toString());l.$events.error(n)},l.send("initThread",{component:n||null,asInstance:!1!==t,imports:e?[].concat(e):null})}return l},unfork:function(n){var e=this;return e.$thread&&(!0===n?e.$thread.terminate():e.send("dispose")),e.$thread=null,e.$events=null,e},initThread:function(){var n=this;return _&&(n.$events={},on.listen(function(e){var t=e.event,r=e.data||null;t&&n.$events[t]?n.$events[t](r):"dispose"===t&&(n.dispose(),on.close())})),n},listen:function(n,e){return n&&b(e)&&this.$events&&(this.$events[n]=e),this},unlisten:function(n,e){return n&&this.$events&&this.$events[n]&&(2>arguments.length||e===this.$events[n])&&delete this.$events[n],this},send:function(n,e){return n&&(_?on.send({event:n,data:e||null}):this.$thread&&this.$thread.postMessage({event:n,data:e||null})),this},task:function(n){return S(n,rn)?n:b(n)?rn(n):void 0},iif:function(){var n=arguments,e=new rn;return e.iif.apply(e,n)},until:function(){var n=w(arguments),e=new rn(n.pop());return e.until.apply(e,n)},untilNot:function(){var n=w(arguments),e=new rn(n.pop());return e.untilNot.apply(e,n)},loop:function(){var n=w(arguments),e=new rn(n.pop());return e.loop.apply(e,n)},each:function(){var n=w(arguments),e=new rn(n.pop());return e.each.apply(e,n)},recurse:function(){var n=w(arguments),e=new rn(n.pop());return e.recurse.apply(e,n)},step:function(n){var e=this;return n&&e.$queue.push(e.task(n).queue(e)),e},steps:function(){var n,e,t=this,r=arguments;for(e=r.length,n=0;e>n;n++)t.step(r[n]);return t},jumpNext:function(n,e){var t=this,r=t.$queue;return e=e||0,!1!==n?function(){return e<r.length&&(e>0&&r.splice(0,e),t.run(t.$runmode)),t}:(e<r.length&&(e>0&&r.splice(0,e),t.run(t.$runmode)),t)},jumpNextWithArgs:function(n,e,t){var r=this,o=r.$queue;return e=e||0,!1!==n?function(){return e<o.length&&(e>0&&o.splice(0,e),r.run(r.$runmode,arguments)),r}:(e<o.length&&(e>0&&o.splice(0,e),r.run(r.$runmode,t)),r)},abort:function(n,e){var t=this;return!1!==n?function(){return e&&e>0?N(function(){t.empty()},e):t.empty(),t}:(e&&e>0?N(function(){t.empty()},e):t.empty(),t)},run:function(n,e){var t=this;return arguments.length?t.$runmode=n:n=t.$runmode,e=e||null,O===n?s(t,e):R===n?i(t,e):x===n?o(t,e):M===n&&r(t,e),t}},_&&(on.log=function(n){on.send({event:"console.log",data:"string"!=typeof n?$(n):n})},on.listen(function(n){var e=n.event,t=n.data||null;switch(e){case"initThread":t&&t.component&&(V&&(b(V.dispose)&&V.dispose(),V=null),V=on.load(t.component,t.imports,t.asInstance));break;case"dispose":V&&(b(V.dispose)&&V.dispose(),V=null),on.close()}})),on});