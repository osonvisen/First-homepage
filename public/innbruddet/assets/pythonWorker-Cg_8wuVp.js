(function(){var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,ee=c.length,u;l<ee;l++)u=c[l],!a.call(e,u)&&u!==o&&t(e,u,{get:(e=>i[e]).bind(null,u),enumerable:!(s=n(i,u))||s.enumerable});return e},c=(n,r,o)=>(o=n==null?{}:e(i(n)),s(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n)),l=/* @__PURE__ */ o(((e,t)=>{t.exports={}})),ee=Object.defineProperty,u=(e,t)=>ee(e,`name`,{value:t,configurable:!0}),te=(e=>typeof require<`u`?require:typeof Proxy<`u`?new Proxy(e,{get:(e,t)=>(typeof require<`u`?require:e)[t]}):e)(function(e){if(typeof require<`u`)return require.apply(this,arguments);throw Error(`Dynamic require of "`+e+`" is not supported`)}),ne=(()=>{for(var e=/* @__PURE__ */ new Uint8Array(128),t=0;t<64;t++)e[t<26?t+65:t<52?t+71:t<62?t-4:t*4-205]=t;return t=>{for(var n=t.length,r=new Uint8Array((n-(t[n-1]==`=`)-(t[n-2]==`=`))*3/4|0),i=0,a=0;i<n;){var o=e[t.charCodeAt(i++)],s=e[t.charCodeAt(i++)],c=e[t.charCodeAt(i++)],l=e[t.charCodeAt(i++)];r[a++]=o<<2|s>>4,r[a++]=s<<4|c>>2,r[a++]=c<<6|l}return r}})();function re(e){return!isNaN(parseFloat(e))&&isFinite(e)}u(re,`_isNumber`);function d(e){return e.charAt(0).toUpperCase()+e.substring(1)}u(d,`_capitalize`);function f(e){return function(){return this[e]}}u(f,`_getter`);var p=[`isConstructor`,`isEval`,`isNative`,`isToplevel`],m=[`columnNumber`,`lineNumber`],h=[`fileName`,`functionName`,`source`],g=p.concat(m,h,[`args`],[`evalOrigin`]);function _(e){if(e)for(var t=0;t<g.length;t++)e[g[t]]!==void 0&&this[`set`+d(g[t])](e[g[t]])}for(u(_,`StackFrame`),_.prototype={getArgs:u(function(){return this.args},`getArgs`),setArgs:u(function(e){if(Object.prototype.toString.call(e)!==`[object Array]`)throw TypeError(`Args must be an Array`);this.args=e},`setArgs`),getEvalOrigin:u(function(){return this.evalOrigin},`getEvalOrigin`),setEvalOrigin:u(function(e){if(e instanceof _)this.evalOrigin=e;else if(e instanceof Object)this.evalOrigin=new _(e);else throw TypeError(`Eval Origin must be an Object or StackFrame`)},`setEvalOrigin`),toString:u(function(){var e=this.getFileName()||``,t=this.getLineNumber()||``,n=this.getColumnNumber()||``,r=this.getFunctionName()||``;return this.getIsEval()?e?`[eval] (`+e+`:`+t+`:`+n+`)`:`[eval]:`+t+`:`+n:r?r+` (`+e+`:`+t+`:`+n+`)`:e+`:`+t+`:`+n},`toString`)},_.fromString=u(function(e){var t=e.indexOf(`(`),n=e.lastIndexOf(`)`),r=e.substring(0,t),i=e.substring(t+1,n).split(`,`),a=e.substring(n+1);if(a.indexOf(`@`)===0)var o=/@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(a,``),s=o[1],c=o[2],l=o[3];return new _({functionName:r,args:i||void 0,fileName:s,lineNumber:c||void 0,columnNumber:l||void 0})},`StackFrame$$fromString`),v=0;v<p.length;v++)_.prototype[`get`+d(p[v])]=f(p[v]),_.prototype[`set`+d(p[v])]=function(e){return function(t){this[e]=!!t}}(p[v]);var v;for(y=0;y<m.length;y++)_.prototype[`get`+d(m[y])]=f(m[y]),_.prototype[`set`+d(m[y])]=function(e){return function(t){if(!re(t))throw TypeError(e+` must be a Number`);this[e]=Number(t)}}(m[y]);var y;for(b=0;b<h.length;b++)_.prototype[`get`+d(h[b])]=f(h[b]),_.prototype[`set`+d(h[b])]=function(e){return function(t){this[e]=String(t)}}(h[b]);var b,x=_;function ie(){var e=/^\s*at .*(\S+:\d+|\(native\))/m,t=/^(eval@)?(\[native code])?$/;return{parse:u(function(t){if(t.stack&&t.stack.match(e))return this.parseV8OrIE(t);if(t.stack)return this.parseFFOrSafari(t);throw Error(`Cannot parse given Error object`)},`ErrorStackParser$$parse`),extractLocation:u(function(e){if(e.indexOf(`:`)===-1)return[e];var t=/(.+?)(?::(\d+))?(?::(\d+))?$/.exec(e.replace(/[()]/g,``));return[t[1],t[2]||void 0,t[3]||void 0]},`ErrorStackParser$$extractLocation`),parseV8OrIE:u(function(t){return t.stack.split(`
`).filter(function(t){return!!t.match(e)},this).map(function(e){e.indexOf(`(eval `)>-1&&(e=e.replace(/eval code/g,`eval`).replace(/(\(eval at [^()]*)|(,.*$)/g,``));var t=e.replace(/^\s+/,``).replace(/\(eval code/g,`(`).replace(/^.*?\s+/,``),n=t.match(/ (\(.+\)$)/);t=n?t.replace(n[0],``):t;var r=this.extractLocation(n?n[1]:t);return new x({functionName:n&&t||void 0,fileName:[`eval`,`<anonymous>`].indexOf(r[0])>-1?void 0:r[0],lineNumber:r[1],columnNumber:r[2],source:e})},this)},`ErrorStackParser$$parseV8OrIE`),parseFFOrSafari:u(function(e){return e.stack.split(`
`).filter(function(e){return!e.match(t)},this).map(function(e){if(e.indexOf(` > eval`)>-1&&(e=e.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g,`:$1`)),e.indexOf(`@`)===-1&&e.indexOf(`:`)===-1)return new x({functionName:e});var t=/((.*".+"[^@]*)?[^@]*)(?:@)/,n=e.match(t),r=n&&n[1]?n[1]:void 0,i=this.extractLocation(e.replace(t,``));return new x({functionName:r,fileName:i[0],lineNumber:i[1],columnNumber:i[2],source:e})},this)},`ErrorStackParser$$parseFFOrSafari`)}}u(ie,`ErrorStackParser`);var ae=new ie;function oe(){return typeof API<`u`&&API!==globalThis.API?API.runtimeEnv:se({IN_BUN:typeof Bun<`u`,IN_DENO:typeof Deno<`u`,IN_NODE:typeof process==`object`&&typeof process.versions==`object`&&typeof process.versions.node==`string`&&!process.browser,IN_SAFARI:typeof navigator==`object`&&typeof navigator.userAgent==`string`&&navigator.userAgent.indexOf(`Chrome`)===-1&&navigator.userAgent.indexOf(`Safari`)>-1,IN_SHELL:typeof read==`function`&&typeof load==`function`})}u(oe,`getGlobalRuntimeEnv`);var S=oe();function se(e){let t=e.IN_NODE&&typeof module<`u`&&module.exports&&typeof te==`function`&&typeof __dirname==`string`,n=e.IN_NODE&&!t,r=!e.IN_NODE&&!e.IN_DENO&&!e.IN_BUN,i=r&&typeof window<`u`&&typeof window.document<`u`&&typeof document.createElement==`function`&&`sessionStorage`in window&&typeof globalThis.importScripts!=`function`,a=r&&typeof globalThis.WorkerGlobalScope<`u`&&typeof globalThis.self<`u`&&globalThis.self instanceof globalThis.WorkerGlobalScope;return{...e,IN_BROWSER:r,IN_BROWSER_MAIN_THREAD:i,IN_BROWSER_WEB_WORKER:a,IN_NODE_COMMONJS:t,IN_NODE_ESM:n}}u(se,`calculateDerivedFlags`);var ce,C,le,ue,w;async function T(){if(!S.IN_NODE||(ce=(await Promise.resolve().then(()=>/* @__PURE__ */ c(l(),1))).default,ue=await Promise.resolve().then(()=>/* @__PURE__ */ c(l(),1)),w=await Promise.resolve().then(()=>/* @__PURE__ */ c(l(),1)),le=(await Promise.resolve().then(()=>/* @__PURE__ */ c(l(),1))).default,C=await Promise.resolve().then(()=>/* @__PURE__ */ c(l(),1)),k=C.sep,typeof te<`u`))return;let e={fs:ue,crypto:await Promise.resolve().then(()=>/* @__PURE__ */ c(l(),1)),ws:await Promise.resolve().then(()=>/* @__PURE__ */ c(l(),1)),child_process:await Promise.resolve().then(()=>/* @__PURE__ */ c(l(),1))};globalThis.require=function(t){return e[t]}}u(T,`initNodeModules`);function E(e,t){return C.resolve(t||`.`,e)}u(E,`node_resolvePath`);function D(e,t){return t===void 0&&(t=location),new URL(e,t).toString()}u(D,`browser_resolvePath`);var O=S.IN_NODE?E:S.IN_SHELL?u(e=>e,`resolvePath`):D,k;S.IN_NODE||(k=`/`);function A(e,t){return e.startsWith(`file://`)&&(e=e.slice(7)),e.includes(`://`)?{response:fetch(e)}:{binary:w.readFile(e).then(e=>new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}}u(A,`node_getBinaryResponse`);function j(e,t){if(e.startsWith(`file://`)&&(e=e.slice(7)),e.includes(`://`))throw Error(`Shell cannot fetch urls`);return{binary:Promise.resolve(new Uint8Array(readbuffer(e)))}}u(j,`shell_getBinaryResponse`);function M(e,t){let n=new URL(e,location);return{response:fetch(n,t?{integrity:t}:{})}}u(M,`browser_getBinaryResponse`);var N=S.IN_NODE?A:S.IN_SHELL?j:M;async function P(e,t){let{response:n,binary:r}=N(e,t);if(r)return r;let i=await n;if(!i.ok)throw Error(`Failed to load '${e}': request failed.`);return new Uint8Array(await i.arrayBuffer())}u(P,`loadBinaryFile`);var F;if(S.IN_BROWSER_MAIN_THREAD)F=u(async e=>await import(e),`loadScript`);else if(S.IN_BROWSER_WEB_WORKER)F=u(async e=>{try{globalThis.importScripts(e)}catch(t){if(t instanceof TypeError)await import(e);else throw t}},`loadScript`);else if(S.IN_NODE)F=I;else if(S.IN_SHELL)F=load;else throw Error(`Cannot determine runtime environment`);async function I(e){e.startsWith(`file://`)&&(e=e.slice(7)),e.includes(`://`)?le.runInThisContext(await(await fetch(e)).text()):await import(ce.pathToFileURL(e).href)}u(I,`nodeLoadScript`);async function L(e){if(S.IN_NODE){await T();let t=await w.readFile(e,{encoding:`utf8`});return JSON.parse(t)}if(S.IN_SHELL){let t=read(e);return JSON.parse(t)}return await(await fetch(e)).json()}u(L,`loadLockFile`);async function R(){if(S.IN_NODE_COMMONJS)return __dirname;let e;try{throw Error()}catch(t){e=t}let t=ae.parse(e)[0].fileName;if(S.IN_NODE&&!t.startsWith(`file://`)&&(t=`file://${t}`),S.IN_NODE_ESM){let e=await Promise.resolve().then(()=>/* @__PURE__ */ c(l(),1));return(await Promise.resolve().then(()=>/* @__PURE__ */ c(l(),1))).fileURLToPath(e.dirname(t))}let n=t.lastIndexOf(k);if(n===-1)throw Error(`Could not extract indexURL path from pyodide module location. Please pass the indexURL explicitly to loadPyodide.`);return t.slice(0,n)}u(R,`calculateDirname`);function z(e){return e.substring(0,e.lastIndexOf(`/`)+1)||globalThis.location?.toString()||`.`}u(z,`calculateInstallBaseUrl`);function B(e){let t=e.FS,n=e.FS.filesystems.MEMFS,r=e.PATH,i={DIR_MODE:16895,FILE_MODE:33279,mount:u(function(e){if(!e.opts.fileSystemHandle)throw Error(`opts.fileSystemHandle is required`);return n.mount.apply(null,arguments)},`mount`),syncfs:u(async(e,t,n)=>{try{let r=i.getLocalSet(e),a=await i.getRemoteSet(e),o=t?a:r,s=t?r:a;await i.reconcile(e,o,s),n(null)}catch(e){n(e)}},`syncfs`),getLocalSet:u(e=>{let n=Object.create(null);function i(e){return e!==`.`&&e!==`..`}u(i,`isRealDir`);function a(e){return t=>r.join2(e,t)}u(a,`toAbsolute`);let o=t.readdir(e.mountpoint).filter(i).map(a(e.mountpoint));for(;o.length;){let e=o.pop(),r=t.stat(e);t.isDir(r.mode)&&o.push.apply(o,t.readdir(e).filter(i).map(a(e))),n[e]={timestamp:r.mtime,mode:r.mode}}return{type:`local`,entries:n}},`getLocalSet`),getRemoteSet:u(async e=>{let t=Object.create(null),n=await de(e.opts.fileSystemHandle);for(let[a,o]of n)a!==`.`&&(t[r.join2(e.mountpoint,a)]={timestamp:o.kind===`file`?new Date((await o.getFile()).lastModified):/* @__PURE__ */ new Date,mode:o.kind===`file`?i.FILE_MODE:i.DIR_MODE});return{type:`remote`,entries:t,handles:n}},`getRemoteSet`),loadLocalEntry:u(e=>{let r=t.lookupPath(e,{}).node,i=t.stat(e);if(t.isDir(i.mode))return{timestamp:i.mtime,mode:i.mode};if(t.isFile(i.mode))return r.contents=n.getFileDataAsTypedArray(r),{timestamp:i.mtime,mode:i.mode,contents:r.contents};throw Error(`node type not supported`)},`loadLocalEntry`),storeLocalEntry:u((e,n)=>{if(t.isDir(n.mode))t.mkdirTree(e,n.mode);else if(t.isFile(n.mode))t.writeFile(e,n.contents,{canOwn:!0});else throw Error(`node type not supported`);t.chmod(e,n.mode),t.utime(e,n.timestamp,n.timestamp)},`storeLocalEntry`),removeLocalEntry:u(e=>{var n=t.stat(e);t.isDir(n.mode)?t.rmdir(e):t.isFile(n.mode)&&t.unlink(e)},`removeLocalEntry`),loadRemoteEntry:u(async e=>{if(e.kind===`file`){let t=await e.getFile();return{contents:new Uint8Array(await t.arrayBuffer()),mode:i.FILE_MODE,timestamp:new Date(t.lastModified)}}if(e.kind===`directory`)return{mode:i.DIR_MODE,timestamp:/* @__PURE__ */ new Date};throw Error(`unknown kind: `+e.kind)},`loadRemoteEntry`),storeRemoteEntry:u(async(e,n,i)=>{let a=e.get(r.dirname(n)),o=t.isFile(i.mode)?await a.getFileHandle(r.basename(n),{create:!0}):await a.getDirectoryHandle(r.basename(n),{create:!0});if(o.kind===`file`){let e=await o.createWritable();await e.write(i.contents),await e.close()}e.set(n,o)},`storeRemoteEntry`),removeRemoteEntry:u(async(e,t)=>{await e.get(r.dirname(t)).removeEntry(r.basename(t)),e.delete(t)},`removeRemoteEntry`),reconcile:u(async(e,n,a)=>{let o=0,s=[];Object.keys(n.entries).forEach(function(e){let r=n.entries[e],i=a.entries[e];(!i||t.isFile(r.mode)&&r.timestamp.getTime()>i.timestamp.getTime())&&(s.push(e),o++)}),s.sort();let c=[];if(Object.keys(a.entries).forEach(function(e){n.entries[e]||(c.push(e),o++)}),c.sort().reverse(),!o)return;let l=n.type===`remote`?n.handles:a.handles;for(let t of s){let n=r.normalize(t.replace(e.mountpoint,`/`)).substring(1);if(a.type===`local`){let e=l.get(n),r=await i.loadRemoteEntry(e);i.storeLocalEntry(t,r)}else{let e=i.loadLocalEntry(t);await i.storeRemoteEntry(l,n,e)}}for(let t of c)if(a.type===`local`)i.removeLocalEntry(t);else{let n=r.normalize(t.replace(e.mountpoint,`/`)).substring(1);await i.removeRemoteEntry(l,n)}},`reconcile`)};e.FS.filesystems.NATIVEFS_ASYNC=i}u(B,`initializeNativeFS`);var de=u(async e=>{let t=[];async function n(e){for await(let r of e.values())t.push(r),r.kind===`directory`&&await n(r)}u(n,`collect`),await n(e);let r=/* @__PURE__ */ new Map;r.set(`.`,e);for(let n of t){let t=(await e.resolve(n)).join(`/`);r.set(t,n)}return r},`getFsHandles`),fe=ne(`AGFzbQEAAAABDANfAGAAAW9gAW8BfwMDAgECByECD2NyZWF0ZV9zZW50aW5lbAAAC2lzX3NlbnRpbmVsAAEKEwIHAPsBAPsbCwkAIAD7GvsUAAs=`),pe=async function(){if(!(globalThis.navigator&&(/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform===`MacIntel`&&typeof navigator.maxTouchPoints<`u`&&navigator.maxTouchPoints>1)))try{let e=await WebAssembly.compile(fe);return await WebAssembly.instantiate(e)}catch(e){if(e instanceof WebAssembly.CompileError)return;throw e}}();async function V(){let e=await pe;if(e)return e.exports;let t=Symbol(`error marker`);return{create_sentinel:u(()=>t,`create_sentinel`),is_sentinel:u(e=>e===t,`is_sentinel`)}}u(V,`getSentinelImport`);function H(e){let t={config:e,runtimeEnv:S},n={noImageDecoding:!0,noAudioDecoding:!0,noWasmDecoding:!1,preRun:ge(e),print:e.stdout,printErr:e.stderr,onExit(e){n.exitCode=e},thisProgram:e._sysExecutable,arguments:e.args,API:t,locateFile:u(t=>e.indexURL+t,`locateFile`),instantiateWasm:_e(e.indexURL)};return n}u(H,`createSettings`);function U(e){return function(t){try{t.FS.mkdirTree(e)}catch(t){console.error(`Error occurred while making a home directory '${e}':`),console.error(t),console.error(`Using '/' for a home directory instead`),e=`/`}t.FS.chdir(e)}}u(U,`createHomeDirectory`);function W(e){return function(t){Object.assign(t.ENV,e)}}u(W,`setEnvironment`);function G(e){return e?[async t=>{t.addRunDependency(`fsInitHook`);try{await e(t.FS,{sitePackages:t.API.sitePackages})}finally{t.removeRunDependency(`fsInitHook`)}}]:[]}u(G,`callFsInitHook`);function me(e){let t=e.HEAPU32[e._Py_Version>>>2];return[t>>>24&255,t>>>16&255,t>>>8&255]}u(me,`computeVersionTuple`);function he(e){let t=P(e);return async e=>{e.API.pyVersionTuple=me(e);let[n,r]=e.API.pyVersionTuple;e.FS.mkdirTree(`/lib`),e.API.sitePackages=`/lib/python${n}.${r}/site-packages`,e.FS.mkdirTree(e.API.sitePackages),e.addRunDependency(`install-stdlib`);try{let i=await t;e.FS.writeFile(`/lib/python${n}${r}.zip`,i)}catch(e){console.error(`Error occurred while installing the standard library:`),console.error(e)}finally{e.removeRunDependency(`install-stdlib`)}}}u(he,`installStdlib`);function ge(e){let t;return t=e.stdLibURL==null?e.indexURL+`python_stdlib.zip`:e.stdLibURL,[he(t),U(e.env.HOME),W(e.env),B,...G(e.fsInit)]}u(ge,`getFileSystemInitializationFuncs`);function _e(e){if(typeof WasmOffsetConverter<`u`)return;let{binary:t,response:n}=N(e+`pyodide.asm.wasm`),r=V();return function(e,i){return async function(){e.sentinel=await r;try{let r;r=n?await WebAssembly.instantiateStreaming(n,e):await WebAssembly.instantiate(await t,e);let{instance:a,module:o}=r;i(a,o)}catch(e){console.warn(`wasm instantiation failed!`),console.warn(e)}}(),{}}}u(_e,`getInstantiateWasmFunc`);var ve=`0.29.3`;function K(e){return e===void 0||e.endsWith(`/`)?e:e+`/`}u(K,`withTrailingSlash`);var ye=ve;async function be(e={}){if(await T(),e.lockFileContents&&e.lockFileURL)throw Error(`Can't pass both lockFileContents and lockFileURL`);let t=e.indexURL||await R();if(t=K(O(t)),e.packageBaseUrl=K(e.packageBaseUrl),e.cdnUrl=K(e.packageBaseUrl??`https://cdn.jsdelivr.net/pyodide/v0.29.3/full/`),!e.lockFileContents){let n=e.lockFileURL??t+`pyodide-lock.json`;e.lockFileContents=L(n),e.packageBaseUrl??=z(n)}e.indexURL=t,e.packageCacheDir&&=K(O(e.packageCacheDir));let n={fullStdLib:!1,jsglobals:globalThis,stdin:globalThis.prompt?()=>globalThis.prompt():void 0,args:[],env:{},packages:[],packageCacheDir:e.packageBaseUrl,enableRunUntilComplete:!0,checkAPIVersion:!0,BUILD_ID:`b7b7b0f46eb68e65c029c0dc739270e8a5d35251e9aab6014ee1c2f630e5d1d0`},r=Object.assign(n,e);return r.env.HOME??=`/home/pyodide`,r.env.PYTHONINSPECT??=`1`,r}u(be,`initializeConfiguration`);function xe(e){let t=H(e),n=t.API;return n.lockFilePromise=Promise.resolve(e.lockFileContents),t}u(xe,`createEmscriptenSettings`);async function Se(e){if(typeof _createPyodideModule!=`function`){let t=`${e.indexURL}pyodide.asm.js`;await F(t)}}u(Se,`loadWasmScript`);async function Ce(e,t){if(!e._loadSnapshot)return;let n=await e._loadSnapshot,r=ArrayBuffer.isView(n)?n:new Uint8Array(n);return t.noInitialRun=!0,t.INITIAL_MEMORY=r.length,r}u(Ce,`prepareSnapshot`);async function we(e){let t=await _createPyodideModule(e);if(e.exitCode!==void 0)throw new t.ExitStatus(e.exitCode);return t}u(we,`createPyodideModule`);function Te(e,t){let n=e.API;if(t.pyproxyToStringRepr&&n.setPyProxyToStringMethod(!0),t.convertNullToNone&&n.setCompatNullToNone(!0),t.toJsLiteralMap&&n.setCompatToJsLiteralMap(!0),n.version!==`0.29.3`&&t.checkAPIVersion)throw Error(`Pyodide version does not match: '${ye}' <==> '${n.version}'. If you updated the Pyodide version, make sure you also updated the 'indexURL' parameter passed to loadPyodide.`);e.locateFile=e=>{throw e.endsWith(`.so`)?/* @__PURE__ */ Error(`Failed to find dynamic library "${e}"`):/* @__PURE__ */ Error(`Unexpected call to locateFile("${e}")`)}}u(Te,`configureAPI`);function Ee(e,t,n){let r=e.API,i;return t&&(i=r.restoreSnapshot(t)),r.finalizeBootstrap(i,n._snapshotDeserializer)}u(Ee,`bootstrapPyodide`);async function De(e,t){let n=e._api;return n.sys.path.insert(0,``),n._pyodide.set_excepthook(),await n.packageIndexReady,n.initializeStreams(t.stdin,t.stdout,t.stderr),e}u(De,`finalizeSetup`);async function Oe(e={}){let t=await be(e),n=xe(t);await Se(t);let r=await Ce(t,n),i=await we(n);return Te(i,t),await De(Ee(i,r,t),t)}u(Oe,`loadPyodide`);let q=`/game`,ke=e=>e.slice(0,e.lastIndexOf(`/`));function Ae(e,t){for(let[n,r]of Object.entries(t))e.FS.mkdirTree(ke(`${q}/${n}`)),e.FS.writeFile(`${q}/${n}`,r);e.runPython(`import sys\nsys.path.insert(0, "${q}")`)}var je=`"""The game's stand-in for the mysql package. Only mysql.connector exists."""
`,Me=`"""A small mysql.connector on top of sqlite3, so the code from the slides runs unchanged in the game.

Part of the game's runtime. Error messages are the SQLite message plus a short Norwegian
explanation; MySQL error codes are not imitated (findings 8).
"""
import sqlite3

# The worker writes a fresh copy of the case database here before every run (DATABASE_PATH in runCode.ts).
DATABASE_PATH = "/data/case.db"
PLACEHOLDER = "%s"
QUOTES = "'\\"\`"


class Error(Exception):
    """Base class for every database error, so \`except Error as e:\` works as in the slides."""


class DatabaseError(Error):
    pass


class ProgrammingError(DatabaseError):
    """The SQL or the parameters are wrong."""


def _from_sqlite(error):
    explanation = "Sjekk tabell- og kolonnenavn, og at SQL-en er skrevet riktig."
    kind = ProgrammingError if isinstance(error, sqlite3.OperationalError) else DatabaseError
    return kind(f"{error}. {explanation}")


def _with_question_marks(sql):
    """Replaces %s with ? outside quotes and counts them. A %s inside quotes is an error."""
    parts = []
    quote = None
    count = 0
    i = 0
    while i < len(sql):
        if sql.startswith(PLACEHOLDER, i):
            if quote is not None:
                raise ProgrammingError("Ikke sett anførselstegn rundt %s. Koblingen legger dem til selv.")
            parts.append("?")
            count += 1
            i += len(PLACEHOLDER)
            continue
        char = sql[i]
        if quote is None and char in QUOTES:
            quote = char
        elif char == quote:
            quote = None
        parts.append(char)
        i += 1
    return "".join(parts), count


def _prepare(operation, params):
    if params is None:
        return operation, ()
    if not isinstance(params, (tuple, list)):
        raise ProgrammingError(
            f"Parameterne må være en tuppel eller en liste, ikke {type(params).__name__}. "
            "En tuppel med én verdi trenger komma: (verdi,)"
        )
    sql, count = _with_question_marks(operation)
    if count != len(params):
        raise ProgrammingError(f"SQL-en har {count} %s, men du sendte {len(params)} verdier. Det må være like mange.")
    return sql, tuple(params)


class Cursor:
    def __init__(self, connection):
        self._cursor = connection.cursor()

    def __enter__(self):
        return self

    def __exit__(self, *exc_info):
        self.close()

    def execute(self, operation, params=None):
        sql, values = _prepare(operation, params)
        try:
            self._cursor.execute(sql, values)
        except sqlite3.Error as error:
            raise _from_sqlite(error) from None

    def fetchall(self):
        return [tuple(row) for row in self._cursor.fetchall()]

    def fetchone(self):
        row = self._cursor.fetchone()
        return None if row is None else tuple(row)

    def close(self):
        self._cursor.close()


class Connection:
    def __init__(self):
        self._connection = sqlite3.connect(DATABASE_PATH)

    def __enter__(self):
        return self

    def __exit__(self, *exc_info):
        self.close()

    def cursor(self):
        return Cursor(self._connection)

    def commit(self):
        self._connection.commit()

    def close(self):
        self._connection.close()


def connect(**connection_details):
    """Ignores host, port, user, password and database, and opens the case database."""
    return Connection()
`;let Ne=[`sqlite3`],Pe=e=>`/pyodide/${e}/`,J=e=>({ok:!0,value:e}),Y=e=>({ok:!1,error:e}),Fe=e=>typeof e==`object`&&!!e,Ie=e=>Array.isArray(e)&&e.every(e=>typeof e==`string`);function Le(e){return Fe(e)?e.type!==`run`&&e.type!==`check`?Y(`Unknown message type: ${String(e.type)}`):typeof e.code==`string`?e.database instanceof Uint8Array?e.type===`run`?J({type:`run`,code:e.code,database:e.database}):typeof e.functionName!=`string`||!Ie(e.inputs)?Y(`A check message has no function name or inputs`):J({type:`check`,code:e.code,database:e.database,functionName:e.functionName,inputs:[...e.inputs]}):Y(`A ${e.type} message has no database`):Y(`A ${e.type} message has no code`):Y(`The message is not an object`)}function Re(e){let t=[],n=!1;return{write:r=>{t.length<e?t.push(r):n=!0},output:()=>({lines:[...t],isTruncated:n})}}let ze=`Traceback (most recent call last):`,Be=e=>e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`);function Ve(e,t){if(!e.includes(ze))return{message:e.trim()};let n=e.slice(e.lastIndexOf(ze)+34).split(`
`),r=RegExp(`^  File "${Be(t)}", line (\\d+)`),i=n.flatMap(e=>r.exec(e)?.[1]??[]),a=n.findIndex(e=>e.length>0&&!e.startsWith(` `)),o=a===-1?e.trim():n.slice(a).join(`
`).trim(),s=i.at(-1);return s===void 0?{message:o}:{message:o,line:Number(s)}}let He=1e3,X=`main.py`,Z=`/data/case.db`,Q=`_game_module_baseline`;function Ue(e){e.runPython(`import sys\n${Q} = set(sys.modules)`)}function We(e){e.runPython(`for name in set(sys.modules) - ${Q}: del sys.modules[name]`)}function Ge(e,t){e.FS.mkdirTree(Z.slice(0,Z.lastIndexOf(`/`))),e.FS.writeFile(Z,t)}async function Ke(e,t,n){We(e),Ge(e,n);let r=Re(He);e.setStdout({batched:r.write}),e.setStderr({batched:r.write});let i=e.globals.get(`dict`)();i.set(`__name__`,`__main__`);try{return await e.runPythonAsync(t,{globals:i,filename:X}),{type:`done`,...r.output()}}catch(e){return{type:`failed`,...Ve(e instanceof Error?e.message:String(e),X),...r.output()}}finally{i.destroy()}}async function qe(e,t,n){Ge(e,n.database);let r=Re(He);e.setStdout({batched:r.write}),e.setStderr({batched:r.write});let i=e.globals.get(`dict`)(),a=e.globals.get(`dict`)();try{i.set(`__name__`,`__main__`);try{await e.runPythonAsync(n.code,{globals:i,filename:X})}catch(e){let t=e instanceof Error?e.message:String(e);return{json:JSON.stringify({kind:`failed`,traceback:t}),...r.output()}}e.runPython(t,{globals:a,filename:`harness.py`});let o=a.get(`run_tests`);try{return{json:String(o(i,n.functionName,JSON.stringify(n.inputs))),...r.output()}}finally{o.destroy()}}finally{i.destroy(),a.destroy()}}var Je=`# The hidden tests of a function stage. The game runs this after the player's code, in its own
# namespace, and reads the JSON that run_tests returns. It never sees the expected results: the
# game compares through sealed keys, so nothing here can reveal them.
import json
import traceback


def _is_value(value):
    # bool is a subclass of int, but True is not a value the database returns.
    return value is None or (isinstance(value, (int, float, str)) and not isinstance(value, bool))


def _call(function, argument):
    try:
        result = function(argument)
    except Exception:
        return {"kind": "error", "traceback": traceback.format_exc()}
    if result is None:
        return {"kind": "none"}
    if not isinstance(result, (list, tuple)):
        return {"kind": "notList", "typeName": type(result).__name__}
    rows = []
    for row in result:
        if not isinstance(row, (list, tuple)) or not all(_is_value(value) for value in row):
            return {"kind": "badRow"}
        rows.append(list(row))
    return {"kind": "rows", "rows": rows}


def run_tests(namespace, function_name, inputs_json):
    function = namespace.get(function_name)
    if not callable(function):
        return json.dumps({"kind": "missing"})
    results = [_call(function, argument) for argument in json.loads(inputs_json)]
    return json.dumps({"kind": "ran", "tests": results})
`;async function Ye(e,t){try{let n=await e();return t({type:`ready`}),J(n)}catch(e){let n=e instanceof Error?e.message:String(e);return t({type:`startupError`,message:n}),Y(n)}}let Xe={"mysql/__init__.py":je,"mysql/connector.py":Me},$=e=>self.postMessage(e),Ze=Ye(async()=>{let e=await Oe({indexURL:Pe(ye),packages:[...Ne]});return Ae(e,Xe),Ue(e),e},$);self.onmessage=async e=>{let t=Le(e.data);if(!t.ok)throw Error(`Invalid message to the Python worker: ${t.error}`);let n=await Ze;if(!n.ok){$({type:`startupError`,message:n.error});return}let r=t.value;r.type===`run`?$(await Ke(n.value,r.code,r.database)):$({type:`checked`,...await qe(n.value,Je,r)})}})();