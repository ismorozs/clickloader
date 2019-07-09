/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/page-script.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/page-script.js":
/*!****************************!*\
  !*** ./src/page-script.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _specialSaveCases__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./specialSaveCases */ "./src/specialSaveCases.js");


const SITE_SPECIAL_CASES = _specialSaveCases__WEBPACK_IMPORTED_MODULE_0__["default"][window.location.hostname];

browser.runtime.onMessage.addListener(onMessage);

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


/***/ }),

/***/ "./src/specialSaveCases.js":
/*!*********************************!*\
  !*** ./src/specialSaveCases.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
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

/******/ });