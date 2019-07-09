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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/background-script.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/background-script.js":
/*!**********************************!*\
  !*** ./src/background-script.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
/* harmony import */ var _values__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./values */ "./src/values.js");




const STATE = {
  active: false,
};

const STATES_ON_TABS = {};

browser.browserAction.setBadgeBackgroundColor({ color: 'green' });
browser.storage.onChanged.addListener(onStorageChange);
browser.tabs.onRemoved.addListener(onTabRemoved);
browser.tabs.onUpdated.addListener(onTabUpdated);
browser.runtime.onMessage.addListener(onMessage);
browser.browserAction.onClicked.addListener(onClicked);

loadSettings();

function loadSettings () {
  return browser.storage.local.get().then((savedOptions) => {

    for (let key in _values__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_SETTINGS"]) {
      if (typeof savedOptions[key] === 'undefined') {
        savedOptions[key] = _values__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_SETTINGS"][key];
        browser.storage.local.set({ [key]: savedOptions[key] });
      }
    }

    Object.assign(STATE, savedOptions);
  });
}

function onTabUpdated (tabId, changeInfo, tab) {
  if (tab.active && tab.status === 'complete') {
    runUserScript(tab, STATE.active, STATE.saveMethod);
  }
}

function onTabRemoved (tabId) {
  STATES_ON_TABS[tabId] = undefined;
}

function runUserScript (tab, active, saveMethod) {
  let executeScript = Promise.resolve();
  let sendMessage = () => {};

  const stateOnTab = STATES_ON_TABS[tab.id];
  if (!stateOnTab || stateOnTab.url !== tab.url) {

    if (!STATE.active) {
      return;
    }

    executeScript = browser.tabs.executeScript(tab.id, { file: '/page-script.js' });
  }

  if (!stateOnTab || stateOnTab.url !== tab.url || stateOnTab.active !== active || stateOnTab.saveMethod !== saveMethod) {
    sendMessage = () => browser.tabs.sendMessage(tab.id, { action: 'switchClickHandler', active, saveMethod });
  }

  STATES_ON_TABS[tab.id] = { active, saveMethod, url: tab.url };

  executeScript.then(sendMessage);
}

function onMessage (data) {
  const imgName = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["removeForbiddenCharacters"])(data.src.split('//')[1], true);
  browser.downloads.download({
    url: data.src,
    saveAs: false,
    filename: STATE.saveFolder + imgName + data.extension
  });
}

function getCurrentTab () {
  return browser.tabs.query({ active: true, currentWindow: true });
}

function onClicked () {
  STATE.active = !STATE.active;
  switchIcon(STATE.active);
  getCurrentTab().then((tabs) => runUserScript(tabs[0], STATE.active, STATE.saveMethod));
}

function switchIcon (active) {
  browser.browserAction.setBadgeText({ text: active ? 'A' : '' });

  const status = active ? 'active' : 'inactive';
  const title = [ _values__WEBPACK_IMPORTED_MODULE_1__["EXTENSION_NAME"] + ' (' + status + ')' ];

  if (active) {
    title.push(
      'Save folder: ' + STATE.saveFolder,
      'Save method: ' + _values__WEBPACK_IMPORTED_MODULE_1__["EVENT_MEANINGS"][ STATE.saveMethod ],
    );
  }
  
  browser.browserAction.setTitle({ title: title.join('\n') });
}

function onStorageChange (changes) {
  for (let key in changes) {
    STATE[key] = changes[key].newValue;
  }

  switchIcon(STATE.active);
}


/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/*! exports provided: removeForbiddenCharacters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeForbiddenCharacters", function() { return removeForbiddenCharacters; });
function removeForbiddenCharacters (str, forFile) {
  const regexpStr = [
    '[\\\\\?%*:|"<>',
    forFile ? '\\/' : '\\.',
    ']'
  ].join('');

  const regexp = new RegExp(regexpStr, 'g');
  return str.replace(regexp, '_');
}


/***/ }),

/***/ "./src/values.js":
/*!***********************!*\
  !*** ./src/values.js ***!
  \***********************/
/*! exports provided: EXTENSION_NAME, DEFAULT_SETTINGS, EVENT_MEANINGS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EXTENSION_NAME", function() { return EXTENSION_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_SETTINGS", function() { return DEFAULT_SETTINGS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EVENT_MEANINGS", function() { return EVENT_MEANINGS; });
const EXTENSION_NAME = 'Clickloader';

const DEFAULT_SETTINGS = {
  saveFolder: EXTENSION_NAME + '/',
  saveMethod: 'contextmenu',
};

const EVENT_MEANINGS = {
  contextmenu: 'Right-click',
  mousedown: 'Shift + Left-click',
  dblclick: 'Double-click',
};


/***/ })

/******/ });