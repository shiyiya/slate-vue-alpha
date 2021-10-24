var Ye=Object.defineProperty;var Y=Object.getOwnPropertySymbols;var Se=Object.prototype.hasOwnProperty,Oe=Object.prototype.propertyIsEnumerable;var ae=(t,n,o)=>n in t?Ye(t,n,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[n]=o,se=(t,n)=>{for(var o in n||(n={}))Se.call(n,o)&&ae(t,o,n[o]);if(Y)for(var o of Y(n))Oe.call(n,o)&&ae(t,o,n[o]);return t};var re=(t,n)=>{var o={};for(var s in t)Se.call(t,s)&&n.indexOf(s)<0&&(o[s]=t[s]);if(t!=null&&Y)for(var s of Y(t))n.indexOf(s)<0&&Oe.call(t,s)&&(o[s]=t[s]);return o};var be=(t,n,o)=>(ae(t,typeof n!="symbol"?n+"":n,o),o);import{E as i,T as b,R as S,r as W,d as P,N as R,t as ke,w as ie,o as j,a as le,b as Q,p as K,c as Z,i as ce,e as ee,P as H,f as O,g as Qe,h as Ze,F as Ce,j as et,k as tt,m as xe,l as nt,n as te,q as ot,s as at,u as st,v as rt,x as it}from"./vendor.5a0c4536.js";const lt=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const d of a.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function o(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerpolicy&&(a.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?a.credentials="include":e.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(e){if(e.ep)return;e.ep=!0;const a=o(e);fetch(e.href,a)}};lt();let ct=0;class dt{constructor(){be(this,"id");this.id=`${ct++}`}}const de=new WeakMap,fe=new WeakMap,ve=new WeakMap,ue=new WeakMap,ne=new WeakMap,U=new WeakMap,pe=new WeakMap,oe=new WeakMap,Be=new WeakMap,V=new WeakMap,ge=new WeakMap,Fe=Symbol("placeholder"),he=t=>t&&t.ownerDocument&&t.ownerDocument.defaultView||null,ft=t=>$(t)&&t.nodeType===8,A=t=>$(t)&&t.nodeType===1,$=t=>{const n=he(t);return!!n&&t instanceof n.Node},Ne=t=>{const n=t&&t.anchorNode&&he(t.anchorNode);return!!n&&t instanceof n.Selection},Me=t=>$(t)&&t.nodeType===3,ut=t=>t.clipboardData&&t.clipboardData.getData("text/plain")!==""&&t.clipboardData.types.length===1,pt=t=>{let[n,o]=t;if(A(n)&&n.childNodes.length){let s=o===n.childNodes.length,e=s?o-1:o;for([n,e]=Ie(n,e,s?"backward":"forward"),s=e<o;A(n)&&n.childNodes.length;){const a=s?n.childNodes.length-1:0;n=ht(n,a,s?"backward":"forward")}o=s&&n.textContent!=null?n.textContent.length:0}return[n,o]},gt=()=>!!(window.document.activeElement&&window.document.activeElement.shadowRoot),Ie=(t,n,o)=>{const{childNodes:s}=t;let e=s[n],a=n,d=!1,f=!1;for(;(ft(e)||A(e)&&e.childNodes.length===0||A(e)&&e.getAttribute("contenteditable")==="false")&&!(d&&f);){if(a>=s.length){d=!0,a=n-1,o="backward";continue}if(a<0){f=!0,a=n+1,o="forward";continue}e=s[a],n=a,a+=o==="forward"?1:-1}return[e,n]},ht=(t,n,o)=>{const[s]=Ie(t,n,o);return s},Le=t=>{let n="";if(Me(t)&&t.nodeValue)return t.nodeValue;if(A(t)){for(const s of Array.from(t.childNodes))n+=Le(s);const o=getComputedStyle(t).getPropertyValue("display");(o==="block"||o==="list"||t.tagName==="BR")&&(n+=`
`)}return n},wt=/data-slate-fragment="(.+?)"/m,mt=t=>{const n=t.getData("text/html"),[,o]=n.match(wt)||[];return o},Dt=typeof navigator!="undefined"&&typeof window!="undefined"&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,Te=typeof navigator!="undefined"&&/Mac OS X/.test(navigator.userAgent);typeof navigator!="undefined"&&/Android/.test(navigator.userAgent);const we=typeof navigator!="undefined"&&/^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent),me=typeof navigator!="undefined"&&/Version\/[\d\.]+.*Safari/.test(navigator.userAgent),yt=typeof navigator!="undefined"&&/Edge?\/(?:[0-6][0-9]|[0-7][0-8])/i.test(navigator.userAgent),Pe=typeof navigator!="undefined"&&/Chrome/i.test(navigator.userAgent),Et=typeof navigator!="undefined"&&/Chrome?\/(?:[0-7][0-5]|[0-6][0-9])/i.test(navigator.userAgent),St=typeof navigator!="undefined"&&/^(?!.*Seamonkey)(?=.*Firefox\/(?:[0-7][0-9]|[0-8][0-6])).*/i.test(navigator.userAgent),Ot=typeof navigator!="undefined"&&/.*QQBrowser/.test(navigator.userAgent),_=!Et&&!yt&&typeof globalThis!="undefined"&&globalThis.InputEvent&&typeof globalThis.InputEvent.prototype.getTargetRanges=="function",c={getWindow(t){const n=ve.get(t);if(!n)throw new Error("Unable to find a host window element for this editor");return n},findKey(t,n){let o=pe.get(n);return o||(o=new dt,pe.set(n,o)),o},findPath(t,n){const o=[];let s=n;for(;;){const e=fe.get(s);if(e==null){if(i.isEditor(s))return o;break}const a=de.get(s);if(a==null)break;o.unshift(a),s=e}throw new Error(`Unable to find the path for Slate node: ${JSON.stringify(n)}`)},findDocumentOrShadowRoot(t){const n=c.toDOMNode(t,t),o=n.getRootNode();return o instanceof Document||o instanceof ShadowRoot&&o.getSelection!=null?o:n.ownerDocument},isFocused(t){return!!V.get(t)},isReadOnly(t){return!!Be.get(t)},blur(t){const n=c.toDOMNode(t,t),o=c.findDocumentOrShadowRoot(t);V.set(t,!1),o.activeElement===n&&n.blur()},focus(t){const n=c.toDOMNode(t,t),o=c.findDocumentOrShadowRoot(t);V.set(t,!0),o.activeElement!==n&&n.focus({preventScroll:!0})},deselect(t){c.toDOMNode(t,t);const{selection:n}=t,s=c.findDocumentOrShadowRoot(t).getSelection();s&&s.rangeCount>0&&s.removeAllRanges(),n&&b.deselect(t)},hasDOMNode(t,n,o={}){const{editable:s=!1}=o,e=c.toDOMNode(t,t);let a;try{a=A(n)?n:n.parentElement}catch(d){if(!d.message.includes('Permission denied to access property "nodeType"'))throw d}return a?a.closest("[data-slate-editor]")===e&&(!s||a.isContentEditable||!!a.getAttribute("data-slate-zero-width")):!1},insertData(t,n){t.insertData(n)},setFragmentData(t,n){t.setFragmentData(n)},toDOMNode(t,n){const o=oe.get(t),s=i.isEditor(n)?ue.get(t):o==null?void 0:o.get(c.findKey(t,n));if(!s)throw new Error(`Cannot resolve a DOM node from Slate node: ${JSON.stringify(n)}`);return s},toDOMPoint(t,n){const[o]=i.node(t,n.path),s=c.toDOMNode(t,o);let e;i.void(t,{at:n})&&(n={path:n.path,offset:0});const a="[data-slate-string], [data-slate-zero-width]",d=Array.from(s.querySelectorAll(a));let f=0;for(const u of d){const p=u.childNodes[0];if(p==null||p.textContent==null)continue;const{length:l}=p.textContent,y=u.getAttribute("data-slate-length"),h=y==null?l:parseInt(y,10),w=f+h;if(n.offset<=w){const E=Math.min(l,Math.max(0,n.offset-f));e=[p,E];break}f=w}if(!e)throw new Error(`Cannot resolve a DOM point from Slate point: ${JSON.stringify(n)}`);return e},toDOMRange(t,n){const{anchor:o,focus:s}=n,e=S.isBackward(n),a=c.toDOMPoint(t,o),d=S.isCollapsed(n)?a:c.toDOMPoint(t,s),u=c.getWindow(t).document.createRange(),[p,l]=e?d:a,[y,h]=e?a:d,E=!!(A(p)?p:p.parentElement).getAttribute("data-slate-zero-width"),x=!!(A(y)?y:y.parentElement).getAttribute("data-slate-zero-width");return u.setStart(p,E?1:l),u.setEnd(y,x?1:h),u},toSlateNode(t,n){let o=A(n)?n:n.parentElement;o&&!o.hasAttribute("data-slate-node")&&(o=o.closest("[data-slate-node]"));const s=o?ne.get(o):null;if(!s)throw new Error(`Cannot resolve a Slate node from DOM node: ${o}`);return s},findEventRange(t,n){"nativeEvent"in n&&(n=n.nativeEvent);const{clientX:o,clientY:s,target:e}=n;if(o==null||s==null)throw new Error(`Cannot resolve a Slate range from a DOM event: ${n}`);const a=c.toSlateNode(t,n.target),d=c.findPath(t,a);if(i.isVoid(t,a)){const l=e.getBoundingClientRect(),y=t.isInline(a)?o-l.left<l.left+l.width-o:s-l.top<l.top+l.height-s,h=i.point(t,d,{edge:y?"start":"end"}),w=y?i.before(t,h):i.after(t,h);if(w)return i.range(t,w)}let f;const{document:u}=window;if(u.caretRangeFromPoint)f=u.caretRangeFromPoint(o,s);else{const l=u.caretPositionFromPoint(o,s);l&&(f=u.createRange(),f.setStart(l.offsetNode,l.offset),f.setEnd(l.offsetNode,l.offset))}if(!f)throw new Error(`Cannot resolve a Slate range from a DOM event: ${n}`);return c.toSlateRange(t,f,{exactMatch:!1,suppressThrow:!1})},toSlatePoint(t,n,o){var h;const{exactMatch:s,suppressThrow:e}=o,[a,d]=s?n:pt(n),f=a.parentNode;let u=null,p=0;if(f){const w=f.closest('[data-slate-void="true"]');let E=f.closest("[data-slate-leaf]"),C=null;if(E){u=E.closest('[data-slate-node="text"]');const k=c.getWindow(t).document.createRange();k.setStart(u,0),k.setEnd(a,d);const g=k.cloneContents();[...Array.prototype.slice.call(g.querySelectorAll("[data-slate-zero-width]")),...Array.prototype.slice.call(g.querySelectorAll("[contenteditable=false]"))].forEach(r=>{r.parentNode.removeChild(r)}),p=g.textContent.length,C=u}else w&&(E=w.querySelector("[data-slate-leaf]"),E?(u=E.closest('[data-slate-node="text"]'),C=E,p=C.textContent.length,C.querySelectorAll("[data-slate-zero-width]").forEach(x=>{p-=x.textContent.length})):p=1);C&&p===C.textContent.length&&(f.hasAttribute("data-slate-zero-width")||we&&((h=C.textContent)==null?void 0:h.endsWith(`

`)))&&p--}if(!u){if(e)return null;throw new Error(`Cannot resolve a Slate point from DOM point: ${n}`)}const l=c.toSlateNode(t,u);return{path:c.findPath(t,l),offset:p}},toSlateRange(t,n,o){const{exactMatch:s,suppressThrow:e}=o,a=Ne(n)?n.anchorNode:n.startContainer;let d,f,u,p,l;if(a&&(Ne(n)?(d=n.anchorNode,f=n.anchorOffset,u=n.focusNode,p=n.focusOffset,Pe&&gt()?l=n.anchorNode===n.focusNode&&n.anchorOffset===n.focusOffset:l=n.isCollapsed):(d=n.startContainer,f=n.startOffset,u=n.endContainer,p=n.endOffset,l=n.collapsed)),d==null||u==null||f==null||p==null)throw new Error(`Cannot resolve a Slate range from DOM range: ${n}`);const y=c.toSlatePoint(t,[d,f],{exactMatch:s,suppressThrow:e});if(!y)return null;const h=l?y:c.toSlatePoint(t,[u,p],{exactMatch:s,suppressThrow:e});if(!h)return null;let w={anchor:y,focus:h};return S.isExpanded(w)&&S.isForward(w)&&A(u)&&i.void(t,{at:w.focus,mode:"highest"})&&(w=i.unhangRange(t,w,{voids:!0})),w},hasRange(t,n){const{anchor:o,focus:s}=n;return i.hasPath(t,o.path)&&i.hasPath(t,s.path)}},q=new WeakMap,J=new WeakMap,bt=(t,n,{onFlushed:o}={})=>{const s=q.get(t);q.set(t,!0);try{n()}finally{s!==void 0&&q.set(t,s)}J.get(t)||o==null||o()},Ae=t=>{const n=J.get(t);J.delete(t),n&&i.withoutNormalizing(t,()=>{n.forEach(o=>{t.apply(o)})})},De=t=>{const n=W(typeof t=="function"?t():t);return[n,o=>{n.value=o}]},kt=typeof Symbol=="function"&&typeof Symbol.toStringTag=="symbol",G=t=>kt?Symbol(t):"[slate-vue]"+t,Re=G("slate"),We=G("slateStatic"),Ct=G("editor_Focused"),_e=G("editor_readOnly"),Ve=G("editor_Decorate"),xt={value:Array,editor:{type:Object,required:!0},onChange:Function},vt=P({props:xt,emits:["change"],setup(t,{emit:n,slots:o}){const[s,e]=De(()=>{const E=t,{editor:l,value:y=[],onChange:h}=E,w=re(E,["editor","value","onChange"]);if(!R.isNodeList(y))throw new Error(`[Slate] value is invalid! Expected a list of elementsbut got: ${JSON.stringify(y)}`);if(!i.isEditor(l))throw new Error(`[Slate] editor is invalid! you passed:${JSON.stringify(l)}`);return l.children=ke(y),Object.assign(l,w),[l]}),[a,d]=De(c.isFocused(t.editor)),f=()=>{var l;n("change",t.editor.children),(l=t.onChange)==null||l.call(t,t.editor.children),e([t.editor])};ie(()=>{ge.set(t.editor,f)});const u=()=>d(c.isFocused(t.editor)),p=()=>d(c.isFocused(t.editor));return j(()=>{document.addEventListener("focus",u,!0),document.addEventListener("blur",p,!0)}),le(()=>{ge.set(t.editor,()=>{}),document.removeEventListener("focus",u,!0),document.removeEventListener("blur",p,!0)}),Q(()=>{d(c.isFocused(t.editor))}),K(Re,s.value),K(We,t.editor),K(Ct,a.value),()=>Z(o,"default")}}),Bt={bold:"mod+b",compose:["down","left","right","up","backspace","enter"],moveBackward:"left",moveForward:"right",moveWordBackward:"ctrl+left",moveWordForward:"ctrl+right",deleteBackward:"shift?+backspace",deleteForward:"shift?+delete",extendBackward:"shift+left",extendForward:"shift+right",italic:"mod+i",splitBlock:"shift?+enter",undo:"mod+z"},Ft={moveLineBackward:"opt+up",moveLineForward:"opt+down",moveWordBackward:"opt+left",moveWordForward:"opt+right",deleteBackward:["ctrl+backspace","ctrl+h"],deleteForward:["ctrl+delete","ctrl+d"],deleteLineBackward:"cmd+shift?+backspace",deleteLineForward:["cmd+shift?+delete","ctrl+k"],deleteWordBackward:"opt+shift?+backspace",deleteWordForward:"opt+shift?+delete",extendLineBackward:"opt+shift+up",extendLineForward:"opt+shift+down",redo:"cmd+shift+z",transposeCharacter:"ctrl+t"},Nt={deleteWordBackward:"ctrl+shift?+backspace",deleteWordForward:"ctrl+shift?+delete",redo:["ctrl+y","ctrl+shift+z"]},v=t=>{const n=Bt[t],o=Ft[t],s=Nt[t],e=n&&ce(n),a=o&&ce(o),d=s&&ce(s);return f=>!!(e&&e(f)||Te&&a&&a(f)||!Te&&d&&d(f))};var B={isBold:v("bold"),isCompose:v("compose"),isMoveBackward:v("moveBackward"),isMoveForward:v("moveForward"),isDeleteBackward:v("deleteBackward"),isDeleteForward:v("deleteForward"),isDeleteLineBackward:v("deleteLineBackward"),isDeleteLineForward:v("deleteLineForward"),isDeleteWordBackward:v("deleteWordBackward"),isDeleteWordForward:v("deleteWordForward"),isExtendBackward:v("extendBackward"),isExtendForward:v("extendForward"),isExtendLineBackward:v("extendLineBackward"),isExtendLineForward:v("extendLineForward"),isItalic:v("italic"),isMoveLineBackward:v("moveLineBackward"),isMoveLineForward:v("moveLineForward"),isMoveWordBackward:v("moveWordBackward"),isMoveWordForward:v("moveWordForward"),isRedo:v("redo"),isSplitBlock:v("splitBlock"),isTransposeCharacter:v("transposeCharacter"),isUndo:v("undo")};function Mt(){const[t]=ee(Re);return t}const It=()=>ee(Ve);function X(){return ee(We)}const Lt={isLast:Boolean,leaf:Object,parent:Object,text:Object},$e=P({props:Lt,setup(t){const n=X();return()=>{const{isLast:o,leaf:s,parent:e,text:a}=t,d=c.findPath(n,a),f=H.parent(d);return n.isVoid(e)?O(ye,{length:R.string(e).length},null):s.text===""&&e.children[e.children.length-1]===a&&!n.isInline(e)&&i.string(n,f)===""?O(ye,{isLineBreak:!0},null):s.text===""?O(ye,null,null):o&&s.text.slice(-1)===`
`?O(je,{isTrailing:!0,text:s.text},null):O(je,{text:s.text},null)}}}),je=P({props:{text:String,isTrailing:Boolean},setup(t){const n=W(null),o=W(0);return ie(()=>{n.value&&n.value.textContent!==t.text&&(o.value+=1)}),()=>O("span",{"data-slate-string":!0,ref:n,key:o.value},[t.text,t.isTrailing?`
`:null])}}),ye=P({props:{length:Number,isLineBreak:Boolean},render(){const{length:t=0,isLineBreak:n=!1}=this.$props;return O("span",{"data-slate-zero-width":n?"n":"z","data-slate-length":t},["\uFEFF",n?O("br",null,null):null])}}),Tt={isLast:Boolean,leaf:Object,parent:Object,text:Object},Pt=P({props:Tt,setup(t){const n=W(null);return Qe([()=>t.leaf,n],()=>{const s=n==null?void 0:n.value,e=document.querySelector('[data-slate-editor="true"]');!s||!e||(e.style.minHeight=`${s.clientHeight}px`)}),Ze(()=>{document.querySelector('[data-slate-editor="true"]').style.minHeight="auto"}),()=>{const{leaf:s,isLast:e,text:a,parent:d}=t;return O(Rt,{attributes:{"data-slate-leaf":!0},leaf:s,text:a},{default:()=>[s[Fe]?O(Ce,null,[O(Kt,{attributes:{"data-slate-placeholder":!0,style:{position:"absolute",pointerEvents:"none",width:"100%",maxWidth:"100%",display:"block",opacity:"0.333",userSelect:"none",textDecoration:"none"},contentEditable:!1,ref:n}},{default:()=>[s.placeholder]}),O($e,{isLast:e,leaf:s,parent:d,text:a},null)]):O($e,{isLast:e,leaf:s,parent:d,text:a},null)]})}}}),At={leaf:Object,text:Object,attributes:Object},Rt=P({props:At,render(){return O("span",this.$props.attributes,[Z(this.$slots,"default")])}}),Wt={decorations:Array,isLast:Boolean,parent:Object,text:Object},He=P({props:Wt,setup(t){const n=X(),o=W(null),{decorations:s,text:e}=t,a=et.decorations(e,s),d=c.findKey(n,e),f=()=>{const u=oe.get(n);o.value?(u==null||u.set(d,o.value),U.set(e,o.value),ne.set(o.value,e)):(u==null||u.delete(d),U.delete(e))};return j(f),Q(f),()=>{const{isLast:u,parent:p,text:l}=t;return O("span",{"data-slate-node":"text",ref:o},[a.map((y,h)=>O(Pt,{isLast:u&&h===a.length-1,key:`${d.id}-${h}`,leaf:y,text:l,parent:p},null))])}}});function _t(){return ee(_e)}function Vt(t){return typeof t=="function"||Object.prototype.toString.call(t)==="[object Object]"&&!nt(t)}const $t={decorations:Array,element:Object,selection:Object},jt=P({props:$t,setup(t){const{decorations:n,element:o,selection:s}=t,e=W(),a=X(),d=_t(),f=a.isInline(o),u=c.findKey(a,o),p={"data-slate-node":"element",ref:e};if(f&&(p["data-slate-inline"]=!0),!f&&i.hasInlines(a,o)){const y=R.string(o),h=tt(y);h==="rtl"&&(p.dir=h)}const l=()=>{const y=oe.get(a);e.value?(y==null||y.set(u,e.value),U.set(o,e.value),ne.set(e.value,o)):(y==null||y.delete(u),U.delete(o))};return j(l),Q(l),()=>{let y,h;return i.isVoid(a,o)&&(p["data-slate-void"]=!0,!d&&f&&(p.contentEditable=!1),y=f?"span":"div",[[h]]=R.texts(o),de.set(h,0),fe.set(h,o)),O(Ut,{element:o,attributes:p},{default:()=>[i.isVoid(a,o)?d?null:O(y,{"data-slate-spacer":!0,style:{height:"0",color:"transparent",outline:"none",position:"absolute"}},{default:()=>[O(He,{decorations:[],isLast:!1,parent:o,text:h},null)]}):O(Ue,{decorations:n,node:o,selection:s},null)]})}}}),Ht={element:Object,attributes:Object},Ut=P({props:Ht,setup(t,{slots:n}){const o=X();return()=>{let s;const{attributes:e,element:a}=t,d=o.isInline(a)?"span":"div";return O(d,xe(e,{style:{position:"relative"}}),Vt(s=Z(n,"default"))?s:{default:()=>[s]})}}}),zt={decorations:Array,node:Object,selection:Object},Ue=P({props:zt,render(){const{decorations:t,node:n,selection:o}=this.$props,s=It()||ze,e=X(),a=c.findPath(e,n),d=te.isElement(n)&&!e.isInline(n)&&i.hasInlines(e,n);return O(Ce,null,[n.children.map((f,u)=>{const p=a.concat(u),l=n.children[u],y=c.findKey(e,l),h=i.range(e,p),w=o&&S.intersection(h,o),E=s([l,p]);for(const C of t){const x=S.intersection(C,h);x&&E.push(x)}return de.set(l,u),fe.set(l,n),te.isElement(l)?O(jt,{decorations:E,element:l,key:y.id,selection:w},null):O(He,{decorations:E,key:y.id,isLast:d&&u===n.children.length-1,parent:n,text:l},null)})])}}),ze=()=>[],Kt=P({render(){return console.log("DefaultPlaceholder",this.$props.attributes),O("span",this.$props.attributes,[Z(this.$slots,"default")])}}),Ke=(t,n)=>{const o=n.startContainer.parentElement;o.getBoundingClientRect=n.getBoundingClientRect.bind(n),at(o,{scrollMode:"if-needed"}),delete o.getBoundingClientRect},T=(t,n)=>$(n)&&c.hasDOMNode(t,n,{editable:!0}),qt=(t,n)=>{if(!n)return!1;const o=n(t);return o!=null?o:t.defaultPrevented},z=(t,n)=>$(n)&&c.hasDOMNode(t,n),qe=(t,n)=>{const o=z(t,n)&&c.toSlateNode(t,n);return i.isVoid(t,o)},L=(t,n)=>{if(!n)return!1;const o=n(t);return o!=null?o:t.defaultPrevented},Jt={decorate:Function,onDOMBeforeInput:Function,placeholder:String,readOnly:Boolean,role:String,style:String,scrollSelectionIntoView:Function,as:Object,autofocus:Boolean,spellcheck:Boolean,autocapitalize:Boolean,autocorrect:Boolean},Gt=P({props:Jt,setup(t){const[n,o]=De(!1),s=W(),e=ke(Mt());ie(()=>{var l;Be.set(e,(l=t.readOnly)!=null?l:!1)});const a={isComposing:!1,hasInsertPrefixInCompositon:!1,isDraggingInternally:!1,isUpdatingSelection:!1,latestElement:null},d=()=>{s.value&&t.autofocus&&s.value.focus();const{scrollSelectionIntoView:l=Ke}=t;let y;s.value&&(y=he(s.value))?(ve.set(e,y),ue.set(e,s.value),U.set(e,s.value),ne.set(s.value,e)):U.delete(e);const{selection:h}=e,E=c.findDocumentOrShadowRoot(e).getSelection();if(a.isComposing||!E||!c.isFocused(e))return;const C=E.type!=="None";if(!h&&!C)return;const x=ue.get(e);let k=!1;if(x.contains(E.anchorNode)&&x.contains(E.focusNode)&&(k=!0),C&&k&&h){const N=c.toSlateRange(e,E,{exactMatch:!1,suppressThrow:!0});if(N&&S.equals(N,h))return}if(h&&!c.hasRange(e,h)){e.selection=c.toSlateRange(e,E,{exactMatch:!1,suppressThrow:!1});return}a.isUpdatingSelection=!0;const g=h&&c.toDOMRange(e,h);g?(S.isBackward(h)?E.setBaseAndExtent(g.endContainer,g.endOffset,g.startContainer,g.startOffset):E.setBaseAndExtent(g.startContainer,g.startOffset,g.endContainer,g.endOffset),l(e,g)):E.removeAllRanges(),setTimeout(()=>{g&&we&&c.toDOMNode(e,e).focus(),a.isUpdatingSelection=!1})};j(d),Q(d);const f=l=>{console.log("onDOMBeforeInput",l);const{onDOMBeforeInput:y,readOnly:h=!1}=t;if(!h&&T(e,l.target)&&!qt(l,y)){const{selection:w}=e,{inputType:E}=l,C=l.dataTransfer||l.data||void 0;if(E==="insertCompositionText"||E==="deleteCompositionText")return;let x=!1;if(E==="insertText"&&w&&S.isCollapsed(w)&&l.data&&l.data.length===1&&/[a-z ]/i.test(l.data)&&w.anchor.offset!==0){x=!0,e.marks&&(x=!1);const{anchor:k}=w,g=i.above(e,{at:k,match:N=>i.isInline(e,N),mode:"highest"});if(g){const[,N]=g;i.isEnd(e,w.anchor,N)&&(x=!1)}}if(x||l.preventDefault(),!E.startsWith("delete")||E.startsWith("deleteBy")){const[k]=l.getTargetRanges();if(k){const g=c.toSlateRange(e,k,{exactMatch:!1,suppressThrow:!1});(!w||!S.equals(w,g))&&b.select(e,g)}}if(w&&S.isExpanded(w)&&E.startsWith("delete")){const k=E.endsWith("Backward")?"backward":"forward";i.deleteFragment(e,{direction:k});return}switch(E){case"deleteByComposition":case"deleteByCut":case"deleteByDrag":{i.deleteFragment(e);break}case"deleteContent":case"deleteContentForward":{i.deleteForward(e);break}case"deleteContentBackward":{i.deleteBackward(e);break}case"deleteEntireSoftLine":{i.deleteBackward(e,{unit:"line"}),i.deleteForward(e,{unit:"line"});break}case"deleteHardLineBackward":{i.deleteBackward(e,{unit:"block"});break}case"deleteSoftLineBackward":{i.deleteBackward(e,{unit:"line"});break}case"deleteHardLineForward":{i.deleteForward(e,{unit:"block"});break}case"deleteSoftLineForward":{i.deleteForward(e,{unit:"line"});break}case"deleteWordBackward":{i.deleteBackward(e,{unit:"word"});break}case"deleteWordForward":{i.deleteForward(e,{unit:"word"});break}case"insertLineBreak":case"insertParagraph":{i.insertBreak(e);break}case"insertFromComposition":case"insertFromDrop":case"insertFromPaste":case"insertFromYank":case"insertReplacementText":case"insertText":{E==="insertFromComposition"&&(a.isComposing&&o(!1),a.isComposing=!1);const k=c.getWindow(e);C instanceof k.DataTransfer?c.insertData(e,C):typeof C=="string"&&(x?bt(e,()=>i.insertText(e,C),{onFlushed:()=>l.preventDefault()}):i.insertText(e,C));break}}}};j(()=>{s.value&&_&&s.value.addEventListener("beforeinput",f)}),le(()=>{s.value&&_&&s.value.removeEventListener("beforeinput",f)});const u=ot(()=>{console.log("onDOMSelectionChange");const{readOnly:l=!1}=t;if(!l&&!a.isComposing&&!a.isUpdatingSelection&&!a.isDraggingInternally){const y=c.findDocumentOrShadowRoot(e),{activeElement:h}=y,w=c.toDOMNode(e,e),E=y.getSelection();if(h===w?(a.latestElement=h,V.set(e,!0)):V.delete(e),!E)return b.deselect(e);const{anchorNode:C,focusNode:x}=E,k=T(e,C)||qe(e,C),g=T(e,x)||qe(e,x);if(k&&g){const N=c.toSlateRange(e,E,{exactMatch:!1,suppressThrow:!1});b.select(e,N)}}},100),p=()=>setTimeout(u);return j(()=>{c.getWindow(e).document.addEventListener("selectionchange",p)}),le(()=>{c.getWindow(e).document.removeEventListener("selectionchange",p)}),K(_e,t.readOnly),K(Ve,t.decorate),()=>{const{placeholder:l,decorate:y=ze}=t,h=y([e,[]]);if(l&&e.children.length===1&&Array.from(R.texts(e)).length===1&&R.string(e)===""&&!n){const r=i.start(e,[]);h.push({[Fe]:!0,placeholder:l,anchor:r,focus:r})}const N=t,{readOnly:w=!1,onDOMBeforeInput:E,scrollSelectionIntoView:C=Ke,style:x={},as:k="div"}=N,g=re(N,["readOnly","onDOMBeforeInput","scrollSelectionIntoView","style","as"]);return O(k,xe({"data-gramm":!1,role:w?void 0:"textbox"},g,{spellCheck:_?g.spellcheck:!1,autoCorrect:_?g.autocorrect:"false",autoCapitalize:_?g.autocapitalize:"false","data-slate-editor":!0,"data-slate-node":"value",contenteditable:w?void 0:!0,suppressContentEditableWarning:!0,ref:s,style:se({position:"relative",outline:"none",whiteSpace:"pre-wrap",wordWrap:"break-word"},x),onBeforeInput:r=>{if(console.log("onBeforeInput",r),!_&&!w&&!L(r,g.onBeforeInput)&&T(e,r.target)&&(r.preventDefault(),!a.isComposing)){const D=r.data;i.insertText(e,D)}},onInput:()=>{console.log("onInput"),Ae(e)},onBlur:r=>{if(console.log("onBlur",r),w||a.isUpdatingSelection||!T(e,r.target)||L(r,g.onBlur))return;const D=c.findDocumentOrShadowRoot(e);if(a.latestElement===D.activeElement)return;const{relatedTarget:m}=r,M=c.toDOMNode(e,e);if(m!==M&&!(A(m)&&m.hasAttribute("data-slate-spacer"))){if(m!=null&&$(m)&&c.hasDOMNode(e,m)){const F=c.toSlateNode(e,m);if(te.isElement(F)&&!e.isVoid(F))return}if(me){const F=D.getSelection();F==null||F.removeAllRanges()}V.delete(e)}},onClick:r=>{if(console.log("onClick",r),!w&&z(e,r.target)&&!L(r,g.onClick)&&$(r.target)){const D=c.toSlateNode(e,r.target),m=c.findPath(e,D),M=i.start(e,m),F=i.end(e,m),I=i.void(e,{at:M}),Ee=i.void(e,{at:F});if(I&&Ee&&H.equals(I[1],Ee[1])){const Xe=i.range(e,M);b.select(e,Xe)}}},onCompositionEnd:r=>{if(console.log("onCompositionEnd",r),T(e,r.target)&&!L(r,g.onCompositionEnd)&&(a.isComposing&&o(!1),a.isComposing=!1,!me&&!St&&!Dt&&!Ot&&r.data&&i.insertText(e,r.data),e.selection&&S.isCollapsed(e.selection))){const D=e.selection.anchor.path,m=R.leaf(e,D);a.hasInsertPrefixInCompositon&&(a.hasInsertPrefixInCompositon=!1,i.withoutNormalizing(e,()=>{const M=m.text.replace(/^\uFEFF/,"");b.delete(e,{distance:m.text.length,reverse:!0}),b.insertText(e,M)}))}},onCompositionUpdate:r=>{console.log("onCompositionUpdate",r),T(e,r.target)&&!L(r,g.onCompositionUpdate)&&(!a.isComposing&&o(!0),a.isComposing=!0)},onCompositionStart:r=>{if(console.log("onCompositionStart",r),T(e,r.target)&&!L(r,g.onCompositionStart)){const{selection:D,marks:m}=e;if(D){if(S.isExpanded(D)){i.deleteFragment(e);return}const M=i.above(e,{match:F=>i.isInline(e,F),mode:"highest"});if(M){const[,F]=M;if(i.isEnd(e,D.anchor,F)){const I=i.after(e,F);b.setSelection(e,{anchor:I,focus:I})}}m&&(a.hasInsertPrefixInCompositon=!0,b.insertNodes(e,se({text:"\uFEFF"},m),{select:!0}))}}},onCopy:r=>{console.log("onCopy",r),T(e,r.target)&&!L(r,g.onCopy)&&(r.preventDefault(),r.clipboardData&&c.setFragmentData(e,r.clipboardData))},onCut:r=>{if(console.log("onCut",r),!w&&T(e,r.target)&&!L(r,g.onCut)){r.preventDefault(),r.clipboardData&&c.setFragmentData(e,r.clipboardData);const{selection:D}=e;if(D)if(S.isExpanded(D))i.deleteFragment(e);else{const m=R.parent(e,D.anchor.path);i.isVoid(e,m)&&b.delete(e)}}},onDragOver:r=>{if(console.log("onDragOver",r),z(e,r.target)&&!L(r,g.onDragOver)){const D=c.toSlateNode(e,r.target);i.isVoid(e,D)&&r.preventDefault()}},onDragStart:r=>{if(console.log("onDragStart",r),z(e,r.target)&&!L(r,g.onDragStart)){const D=c.toSlateNode(e,r.target),m=c.findPath(e,D);if(i.isVoid(e,D)||i.void(e,{at:m,voids:!0})){const F=i.range(e,m);b.select(e,F)}a.isDraggingInternally=!0,r.dataTransfer&&c.setFragmentData(e,r.dataTransfer)}},onDrop:r=>{if(console.log("onDrop",r),!w&&z(e,r.target)&&!L(r,g.onDrop)){r.preventDefault();const D=e.selection,m=c.findEventRange(e,r),M=r.dataTransfer;b.select(e,m),a.isDraggingInternally&&(D&&b.delete(e,{at:D}),a.isDraggingInternally=!1),M&&c.insertData(e,M),c.isFocused(e)||c.focus(e)}},onDragEnd:r=>{console.log("onDragEnd",r),!w&&a.isDraggingInternally&&z(e,r.target)&&!L(r,g.onDragEnd)&&(a.isDraggingInternally=!1)},onFocus:r=>{if(console.log("onFocus",r),!w&&!a.isUpdatingSelection&&T(e,r.target)&&!L(r,g.onFocus)){const D=c.toDOMNode(e,e),m=c.findDocumentOrShadowRoot(e);if(a.latestElement=m.activeElement,we&&r.target!==D){D.focus();return}V.set(e,!0)}},onKeyDown:r=>{if(console.log("onKeyDown",r),!w&&!a.isComposing&&T(e,r.target)&&!L(r,g.onKeyDown)){const D=r,{selection:m}=e,M=e.children[m!==null?m.focus.path[0]:0],F=(void 0)(R.string(M))==="rtl";if(B.isRedo(D)){r.preventDefault();const I=e;typeof I.redo=="function"&&I.redo();return}if(B.isUndo(D)){r.preventDefault();const I=e;typeof I.undo=="function"&&I.undo();return}if(B.isMoveLineBackward(D)){r.preventDefault(),b.move(e,{unit:"line",reverse:!0});return}if(B.isMoveLineForward(D)){r.preventDefault(),b.move(e,{unit:"line"});return}if(B.isExtendLineBackward(D)){r.preventDefault(),b.move(e,{unit:"line",edge:"focus",reverse:!0});return}if(B.isExtendLineForward(D)){r.preventDefault(),b.move(e,{unit:"line",edge:"focus"});return}if(B.isMoveBackward(D)){r.preventDefault(),m&&S.isCollapsed(m)?b.move(e,{reverse:!F}):b.collapse(e,{edge:"start"});return}if(B.isMoveForward(D)){r.preventDefault(),m&&S.isCollapsed(m)?b.move(e,{reverse:F}):b.collapse(e,{edge:"end"});return}if(B.isMoveWordBackward(D)){r.preventDefault(),m&&S.isExpanded(m)&&b.collapse(e,{edge:"focus"}),b.move(e,{unit:"word",reverse:!F});return}if(B.isMoveWordForward(D)){r.preventDefault(),m&&S.isExpanded(m)&&b.collapse(e,{edge:"focus"}),b.move(e,{unit:"word",reverse:F});return}if(_){if((Pe||me)&&m&&(B.isDeleteBackward(D)||B.isDeleteForward(D))&&S.isCollapsed(m)){const I=R.parent(e,m.anchor.path);if(te.isElement(I)&&i.isVoid(e,I)&&i.isInline(e,I)){r.preventDefault(),i.deleteBackward(e,{unit:"block"});return}}}else{if(B.isBold(D)||B.isItalic(D)||B.isTransposeCharacter(D)){r.preventDefault();return}if(B.isSplitBlock(D)){r.preventDefault(),i.insertBreak(e);return}if(B.isDeleteBackward(D)){r.preventDefault(),m&&S.isExpanded(m)?i.deleteFragment(e,{direction:"backward"}):i.deleteBackward(e);return}if(B.isDeleteForward(D)){r.preventDefault(),m&&S.isExpanded(m)?i.deleteFragment(e,{direction:"forward"}):i.deleteForward(e);return}if(B.isDeleteLineBackward(D)){r.preventDefault(),m&&S.isExpanded(m)?i.deleteFragment(e,{direction:"backward"}):i.deleteBackward(e,{unit:"line"});return}if(B.isDeleteLineForward(D)){r.preventDefault(),m&&S.isExpanded(m)?i.deleteFragment(e,{direction:"forward"}):i.deleteForward(e,{unit:"line"});return}if(B.isDeleteWordBackward(D)){r.preventDefault(),m&&S.isExpanded(m)?i.deleteFragment(e,{direction:"backward"}):i.deleteBackward(e,{unit:"word"});return}if(B.isDeleteWordForward(D)){r.preventDefault(),m&&S.isExpanded(m)?i.deleteFragment(e,{direction:"forward"}):i.deleteForward(e,{unit:"word"});return}}}},onPaste:r=>{console.log("onPaste"),!w&&T(e,r.target)&&!L(r,g.onPaste)&&(!_||ut(r))&&(r.preventDefault(),(r==null?void 0:r.clipboardData)&&c.insertData(e,r.clipboardData))}}),{default:()=>[O(Ue,{decorations:h,node:e,selection:e.selection},null)]})}}}),Je=(t,n)=>{const o=(n.top+n.bottom)/2;return t.top<=o&&t.bottom>=o},Ge=(t,n,o)=>{const s=c.toDOMRange(t,n).getBoundingClientRect(),e=c.toDOMRange(t,o).getBoundingClientRect();return Je(s,e)&&Je(e,s)},Xt=(t,n)=>{const o=i.range(t,S.end(n)),s=Array.from(i.positions(t,{at:n}));let e=0,a=s.length,d=Math.floor(a/2);if(Ge(t,i.range(t,s[e]),o))return i.range(t,s[e],o);if(s.length<2)return i.range(t,s[s.length-1],o);for(;d!==s.length&&d!==e;)Ge(t,i.range(t,s[d]),o)?a=d:e=d,d=Math.floor((e+a)/2);return i.range(t,s[a],o)},Yt=t=>{const n=t,{apply:o,onChange:s,deleteBackward:e}=n;return oe.set(n,new WeakMap),n.deleteBackward=a=>{if(a!=="line")return e(a);if(t.selection&&S.isCollapsed(t.selection)){const d=i.above(t,{match:f=>i.isBlock(t,f),at:t.selection});if(d){const[,f]=d,u=i.range(t,f,t.selection.anchor),p=Xt(n,u);S.isCollapsed(p)||b.delete(t,{at:p})}}},n.apply=a=>{if(a.type!=="insert_text"&&(q.set(t,!1),Ae(t)),q.get(t)){const f=J.get(t);f?f.push(a):J.set(t,[a]);return}const d=[];switch(a.type){case"insert_text":case"remove_text":case"set_node":{for(const[f,u]of i.levels(n,{at:a.path})){const p=c.findKey(n,f);d.push([u,p])}break}case"insert_node":case"remove_node":case"merge_node":case"split_node":{for(const[f,u]of i.levels(n,{at:H.parent(a.path)})){const p=c.findKey(n,f);d.push([u,p])}break}case"move_node":{for(const[f,u]of i.levels(n,{at:H.common(H.parent(a.path),H.parent(a.newPath))})){const p=c.findKey(n,f);d.push([u,p])}break}}o(a);for(const[f,u]of d){const[p]=i.node(n,f);pe.set(p,u)}},n.setFragmentData=a=>{const{selection:d}=n;if(!d)return;const[f,u]=S.edges(d),p=i.void(n,{at:f.path}),l=i.void(n,{at:u.path});if(S.isCollapsed(d)&&!p)return;const y=c.toDOMRange(n,d);let h=y.cloneContents(),w=h.childNodes[0];if(h.childNodes.forEach(g=>{g.textContent&&g.textContent.trim()!==""&&(w=g)}),l){const[g]=l,N=y.cloneRange(),r=c.toDOMNode(n,g);N.setEndAfter(r),h=N.cloneContents()}if(p&&(w=h.querySelector("[data-slate-spacer]")),Array.from(h.querySelectorAll("[data-slate-zero-width]")).forEach(g=>{const N=g.getAttribute("data-slate-zero-width")==="n";g.textContent=N?`
`:""}),Me(w)){const g=document.createElement("span");g.style.whiteSpace="pre",g.appendChild(w),h.appendChild(g),w=g}const E=n.getFragment(),C=JSON.stringify(E),x=window.btoa(encodeURIComponent(C));w.setAttribute("data-slate-fragment",x),a.setData("application/x-slate-fragment",x);const k=document.createElement("div");return k.appendChild(h),k.setAttribute("hidden","true"),document.body.appendChild(k),a.setData("text/html",k.innerHTML),a.setData("text/plain",Le(k)),document.body.removeChild(k),a},n.insertData=a=>{const d=a.getData("application/x-slate-fragment")||mt(a);if(d){const u=decodeURIComponent(window.atob(d)),p=JSON.parse(u);n.insertFragment(p);return}const f=a.getData("text/plain");if(f){const u=f.split(/\r\n|\r|\n/);let p=!1;for(const l of u)p&&b.splitNodes(n,{always:!0}),n.insertText(l),p=!0}},n.onChange=()=>{var a;(a=ge.get(n))==null||a(),s()},n};var Qt={setup(){const t=st({count:0,o:{count:0},readOnly:!1}),n=Yt(rt());let o=W([{type:"paragraph",children:[{text:"Try it out for yourself!"}]}]);const s=e=>{o.value=e};return()=>O("div",{class:"slate"},[O(vt,{editor:n,value:o.value,onChange:s},{default:()=>[O(Gt,{placeholder:"Typo anything...",readOnly:t.readOnly},null)]})])}};it(Qt).mount("#app");
