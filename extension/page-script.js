/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/webextension-polyfill/dist/browser-polyfill.min.js":
/*!*************************************************************************!*\
  !*** ./node_modules/webextension-polyfill/dist/browser-polyfill.min.js ***!
  \*************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, module, __webpack_exports__ */
/*! CommonJS bailout: this is used directly at 1:199-203 */
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(a,b){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (b),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else { var c; }})(this,function(a){"use strict";if("undefined"==typeof browser||Object.getPrototypeOf(browser)!==Object.prototype){a.exports=(e=>{const f={alarms:{clear:{minArgs:0,maxArgs:1},clearAll:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getAll:{minArgs:0,maxArgs:0}},bookmarks:{create:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},getChildren:{minArgs:1,maxArgs:1},getRecent:{minArgs:1,maxArgs:1},getSubTree:{minArgs:1,maxArgs:1},getTree:{minArgs:0,maxArgs:0},move:{minArgs:2,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeTree:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}},browserAction:{disable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},enable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},getBadgeBackgroundColor:{minArgs:1,maxArgs:1},getBadgeText:{minArgs:1,maxArgs:1},getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},openPopup:{minArgs:0,maxArgs:0},setBadgeBackgroundColor:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setBadgeText:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},browsingData:{remove:{minArgs:2,maxArgs:2},removeCache:{minArgs:1,maxArgs:1},removeCookies:{minArgs:1,maxArgs:1},removeDownloads:{minArgs:1,maxArgs:1},removeFormData:{minArgs:1,maxArgs:1},removeHistory:{minArgs:1,maxArgs:1},removeLocalStorage:{minArgs:1,maxArgs:1},removePasswords:{minArgs:1,maxArgs:1},removePluginData:{minArgs:1,maxArgs:1},settings:{minArgs:0,maxArgs:0}},commands:{getAll:{minArgs:0,maxArgs:0}},contextMenus:{remove:{minArgs:1,maxArgs:1},removeAll:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},cookies:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:1,maxArgs:1},getAllCookieStores:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},devtools:{inspectedWindow:{eval:{minArgs:1,maxArgs:2,singleCallbackArg:!1}},panels:{create:{minArgs:3,maxArgs:3,singleCallbackArg:!0}}},downloads:{cancel:{minArgs:1,maxArgs:1},download:{minArgs:1,maxArgs:1},erase:{minArgs:1,maxArgs:1},getFileIcon:{minArgs:1,maxArgs:2},open:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},pause:{minArgs:1,maxArgs:1},removeFile:{minArgs:1,maxArgs:1},resume:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},extension:{isAllowedFileSchemeAccess:{minArgs:0,maxArgs:0},isAllowedIncognitoAccess:{minArgs:0,maxArgs:0}},history:{addUrl:{minArgs:1,maxArgs:1},deleteAll:{minArgs:0,maxArgs:0},deleteRange:{minArgs:1,maxArgs:1},deleteUrl:{minArgs:1,maxArgs:1},getVisits:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1}},i18n:{detectLanguage:{minArgs:1,maxArgs:1},getAcceptLanguages:{minArgs:0,maxArgs:0}},identity:{launchWebAuthFlow:{minArgs:1,maxArgs:1}},idle:{queryState:{minArgs:1,maxArgs:1}},management:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},getSelf:{minArgs:0,maxArgs:0},setEnabled:{minArgs:2,maxArgs:2},uninstallSelf:{minArgs:0,maxArgs:1}},notifications:{clear:{minArgs:1,maxArgs:1},create:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:0},getPermissionLevel:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},pageAction:{getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},hide:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},permissions:{contains:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},request:{minArgs:1,maxArgs:1}},runtime:{getBackgroundPage:{minArgs:0,maxArgs:0},getBrowserInfo:{minArgs:0,maxArgs:0},getPlatformInfo:{minArgs:0,maxArgs:0},openOptionsPage:{minArgs:0,maxArgs:0},requestUpdateCheck:{minArgs:0,maxArgs:0},sendMessage:{minArgs:1,maxArgs:3},sendNativeMessage:{minArgs:2,maxArgs:2},setUninstallURL:{minArgs:1,maxArgs:1}},sessions:{getDevices:{minArgs:0,maxArgs:1},getRecentlyClosed:{minArgs:0,maxArgs:1},restore:{minArgs:0,maxArgs:1}},storage:{local:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},managed:{get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1}},sync:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}}},tabs:{captureVisibleTab:{minArgs:0,maxArgs:2},create:{minArgs:1,maxArgs:1},detectLanguage:{minArgs:0,maxArgs:1},discard:{minArgs:0,maxArgs:1},duplicate:{minArgs:1,maxArgs:1},executeScript:{minArgs:1,maxArgs:2},get:{minArgs:1,maxArgs:1},getCurrent:{minArgs:0,maxArgs:0},getZoom:{minArgs:0,maxArgs:1},getZoomSettings:{minArgs:0,maxArgs:1},highlight:{minArgs:1,maxArgs:1},insertCSS:{minArgs:1,maxArgs:2},move:{minArgs:2,maxArgs:2},query:{minArgs:1,maxArgs:1},reload:{minArgs:0,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeCSS:{minArgs:1,maxArgs:2},sendMessage:{minArgs:2,maxArgs:3},setZoom:{minArgs:1,maxArgs:2},setZoomSettings:{minArgs:1,maxArgs:2},update:{minArgs:1,maxArgs:2}},topSites:{get:{minArgs:0,maxArgs:0}},webNavigation:{getAllFrames:{minArgs:1,maxArgs:1},getFrame:{minArgs:1,maxArgs:1}},webRequest:{handlerBehaviorChanged:{minArgs:0,maxArgs:0}},windows:{create:{minArgs:0,maxArgs:1},get:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:1},getCurrent:{minArgs:0,maxArgs:1},getLastFocused:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}}};if(0===Object.keys(f).length)throw new Error("api-metadata.json has not been included in browser-polyfill");class g extends WeakMap{constructor(v,w=void 0){super(w),this.createItem=v}get(v){return this.has(v)||this.set(v,this.createItem(v)),super.get(v)}}const h=v=>{return v&&"object"==typeof v&&"function"==typeof v.then},i=(v,w)=>{return(...x)=>{e.runtime.lastError?v.reject(e.runtime.lastError):w.singleCallbackArg||1>=x.length&&!1!==w.singleCallbackArg?v.resolve(x[0]):v.resolve(x)}},j=v=>1==v?"argument":"arguments",k=(v,w)=>{return function(y,...z){if(z.length<w.minArgs)throw new Error(`Expected at least ${w.minArgs} ${j(w.minArgs)} for ${v}(), got ${z.length}`);if(z.length>w.maxArgs)throw new Error(`Expected at most ${w.maxArgs} ${j(w.maxArgs)} for ${v}(), got ${z.length}`);return new Promise((A,B)=>{if(w.fallbackToNoCallback)try{y[v](...z,i({resolve:A,reject:B},w))}catch(C){console.warn(`${v} API method doesn't seem to support the callback parameter, `+"falling back to call it without a callback: ",C),y[v](...z),w.fallbackToNoCallback=!1,w.noCallback=!0,A()}else w.noCallback?(y[v](...z),A()):y[v](...z,i({resolve:A,reject:B},w))})}},l=(v,w,x)=>{return new Proxy(w,{apply(y,z,A){return x.call(z,v,...A)}})};let m=Function.call.bind(Object.prototype.hasOwnProperty);const n=(v,w={},x={})=>{let y=Object.create(null),z={has(B,C){return C in v||C in y},get(B,C){if(C in y)return y[C];if(C in v){let E=v[C];if("function"==typeof E){if("function"==typeof w[C])E=l(v,v[C],w[C]);else if(m(x,C)){let F=k(C,x[C]);E=l(v,v[C],F)}else E=E.bind(v);}else if("object"==typeof E&&null!==E&&(m(w,C)||m(x,C)))E=n(E,w[C],x[C]);else return Object.defineProperty(y,C,{configurable:!0,enumerable:!0,get(){return v[C]},set(F){v[C]=F}}),E;return y[C]=E,E}},set(B,C,D){return C in y?y[C]=D:v[C]=D,!0},defineProperty(B,C,D){return Reflect.defineProperty(y,C,D)},deleteProperty(B,C){return Reflect.deleteProperty(y,C)}},A=Object.create(v);return new Proxy(A,z)},o=v=>({addListener(w,x,...y){w.addListener(v.get(x),...y)},hasListener(w,x){return w.hasListener(v.get(x))},removeListener(w,x){w.removeListener(v.get(x))}});let p=!1;const q=new g(v=>{return"function"==typeof v?function(x,y,z){let B,D,A=!1,C=new Promise(G=>{B=function(H){p||(console.warn("Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)",new Error().stack),p=!0),A=!0,G(H)}});try{D=v(x,y,B)}catch(G){D=Promise.reject(G)}const E=!0!==D&&h(D);if(!0!==D&&!E&&!A)return!1;const F=G=>{G.then(H=>{z(H)},H=>{let I;I=H&&(H instanceof Error||"string"==typeof H.message)?H.message:"An unexpected error occurred",z({__mozWebExtensionPolyfillReject__:!0,message:I})}).catch(H=>{console.error("Failed to send onMessage rejected reply",H)})};return E?F(D):F(C),!0}:v}),r=({reject:v,resolve:w},x)=>{e.runtime.lastError?e.runtime.lastError.message==="The message port closed before a response was received."?w():v(e.runtime.lastError):x&&x.__mozWebExtensionPolyfillReject__?v(new Error(x.message)):w(x)},s=(v,w,x,...y)=>{if(y.length<w.minArgs)throw new Error(`Expected at least ${w.minArgs} ${j(w.minArgs)} for ${v}(), got ${y.length}`);if(y.length>w.maxArgs)throw new Error(`Expected at most ${w.maxArgs} ${j(w.maxArgs)} for ${v}(), got ${y.length}`);return new Promise((z,A)=>{const B=r.bind(null,{resolve:z,reject:A});y.push(B),x.sendMessage(...y)})},t={runtime:{onMessage:o(q),onMessageExternal:o(q),sendMessage:s.bind(null,"sendMessage",{minArgs:1,maxArgs:3})},tabs:{sendMessage:s.bind(null,"sendMessage",{minArgs:2,maxArgs:3})}},u={clear:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}};return f.privacy={network:{networkPredictionEnabled:u,webRTCIPHandlingPolicy:u},services:{passwordSavingEnabled:u},websites:{hyperlinkAuditingEnabled:u,referrersEnabled:u}},n(e,t,f)})(chrome)}else a.exports=browser});
//# sourceMappingURL=browser-polyfill.min.js.map

// webextension-polyfill v.0.4.0 (https://github.com/mozilla/webextension-polyfill)

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/***/ }),

/***/ "./src/page-script.js":
/*!****************************!*\
  !*** ./src/page-script.js ***!
  \****************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _page_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./page/index */ "./src/page/index.js");


(0,_page_index__WEBPACK_IMPORTED_MODULE_0__.default)();


/***/ }),

/***/ "./src/page/index.js":
/*!***************************!*\
  !*** ./src/page/index.js ***!
  \***************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _specialSaveCases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./specialSaveCases */ "./src/page/specialSaveCases.js");
const browser = __webpack_require__(/*! webextension-polyfill/dist/browser-polyfill.min */ "./node_modules/webextension-polyfill/dist/browser-polyfill.min.js");



const SITE_SPECIAL_CASES = _specialSaveCases__WEBPACK_IMPORTED_MODULE_0__.default[window.location.hostname];

function init () {
  if (!window.hasRun) {
    window.hasRun = true;
  
    browser.runtime.onMessage.addListener(onMessage);
  }
}

function onMessage (message) {
  switchClickHandler(message);
  window.saveMethod = message.saveMethod;
}

function switchClickHandler (data) {
  if (window.saveMethod !== data.saveMethod) {
    document.body.removeEventListener(window.saveMethod, sendImageUrl);
  }

  const operation = data.active ? 'add' : 'remove';
  document.body[operation + 'EventListener'](data.saveMethod, sendImageUrl);
}

function sendImageUrl (e) {
  if (window.saveMethod === 'mousedown' && !e.shiftKey) {
    return;
  }

  const srcData = extractSrc(e.target);
  if (srcData.src) {
    browser.runtime.sendMessage({
      src: srcData.src,
      extension: srcData.extension || '',
    });
  }
}

function extractSrc (el) {
  if (SITE_SPECIAL_CASES) {
    for (let selector in SITE_SPECIAL_CASES) {
      if (el.matches(selector)) {
        return SITE_SPECIAL_CASES[selector](el);
      }
    }
  }

  if (!!el.src) {
    return { src: el.src };
  }

  const testEl = document.createElement(el.tagName);
  const possibleSources = el.querySelectorAll('source');

  if (!possibleSources.length) {
    return {};
  }

  let src = null;
  for (let i = 0; i < possibleSources.length; i++) {
    const source = possibleSources[i];

    if (!!testEl.canPlayType(source.type)) {
      src = source.src;
      break;
    }

  }

  if (!src) {
    src = possibleSources[0].src;
  }

  return { src };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (init);

/***/ }),

/***/ "./src/page/specialSaveCases.js":
/*!**************************************!*\
  !*** ./src/page/specialSaveCases.js ***!
  \**************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  'www.instagram.com': {

    'div._9AhH0': (el) => ({
      src: el.previousElementSibling.firstElementChild.src,
      extension: '.jpg'
    }),

    'img._6q-tv': (el) => ({
      src: el.src,
      extension: '.jpg'
    })

  }
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/page-script.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;