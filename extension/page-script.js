/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/webextension-polyfill/dist/browser-polyfill.js":
/*!*********************************************************************!*\
  !*** ./node_modules/webextension-polyfill/dist/browser-polyfill.js ***!
  \*********************************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else // removed by dead control flow
{ var mod; }
})(this, function (module) {
  /* webextension-polyfill - v0.4.0 - Wed Feb 06 2019 11:58:31 */
  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */
  /* vim: set sts=2 sw=2 et tw=80: */
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (typeof browser === "undefined" || Object.getPrototypeOf(browser) !== Object.prototype) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
    const SEND_RESPONSE_DEPRECATION_WARNING = "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)";

    // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.
    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getBrowserInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };

      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }

      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */
      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }

        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }

          return super.get(key);
        }
      }

      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */
      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };

      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.rejection
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {integer} metadata.maxResolvedArgs
       *        The maximum number of arguments which may be passed to the
       *        callback created by the wrapped async function.
       *
       * @returns {function}
       *        The generated callback function.
       */
      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(extensionAPIs.runtime.lastError);
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };

      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";

      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxResolvedArgs
       *        The maximum number of arguments which may be passed to the
       *        callback created by the wrapped async function.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */
      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }

          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }

          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({ resolve, reject }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);

                target[name](...args);

                // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.
                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;

                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({ resolve, reject }, metadata));
            }
          });
        };
      };

      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */
      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }
        });
      };

      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */
      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },

          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }

            if (!(prop in target)) {
              return undefined;
            }

            let value = target[prop];

            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.

              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,
                get() {
                  return target[prop];
                },
                set(value) {
                  target[prop] = value;
                }
              });

              return value;
            }

            cache[prop] = value;
            return value;
          },

          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }
            return true;
          },

          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },

          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }
        };

        // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.
        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };

      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */
      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },

        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },

        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }
      });

      // Keep track if the deprecation warning has been logged at least once.
      let loggedSendResponseDeprecationWarning = false;

      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */
        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;

          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              if (!loggedSendResponseDeprecationWarning) {
                console.warn(SEND_RESPONSE_DEPRECATION_WARNING, new Error().stack);
                loggedSendResponseDeprecationWarning = true;
              }
              didCallSendResponse = true;
              resolve(response);
            };
          });

          let result;
          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }

          const isResultThenable = result !== true && isThenable(result);

          // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.
          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          }

          // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).
          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;
              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }

              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          };

          // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.
          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          }

          // Let Chrome know that the listener is replying.
          return true;
        };
      });

      const wrappedSendMessageCallback = ({ reject, resolve }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(extensionAPIs.runtime.lastError);
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };

      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }

        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }

        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, { resolve, reject });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };

      const staticWrappers = {
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", { minArgs: 1, maxArgs: 3 })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", { minArgs: 2, maxArgs: 3 })
        }
      };
      const settingMetadata = {
        clear: { minArgs: 1, maxArgs: 1 },
        get: { minArgs: 1, maxArgs: 1 },
        set: { minArgs: 1, maxArgs: 1 }
      };
      apiMetadata.privacy = {
        network: {
          networkPredictionEnabled: settingMetadata,
          webRTCIPHandlingPolicy: settingMetadata
        },
        services: {
          passwordSavingEnabled: settingMetadata
        },
        websites: {
          hyperlinkAuditingEnabled: settingMetadata,
          referrersEnabled: settingMetadata
        }
      };

      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    };

    // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.
    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = browser;
  }
});
//# sourceMappingURL=browser-polyfill.js.map


/***/ }),

/***/ "./node_modules/webextension-polyfill/dist/browser-polyfill.min.js":
/*!*************************************************************************!*\
  !*** ./node_modules/webextension-polyfill/dist/browser-polyfill.min.js ***!
  \*************************************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(a,b){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (b),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else // removed by dead control flow
{ var c; }})(this,function(a){"use strict";if("undefined"==typeof browser||Object.getPrototypeOf(browser)!==Object.prototype){a.exports=(e=>{const f={alarms:{clear:{minArgs:0,maxArgs:1},clearAll:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getAll:{minArgs:0,maxArgs:0}},bookmarks:{create:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},getChildren:{minArgs:1,maxArgs:1},getRecent:{minArgs:1,maxArgs:1},getSubTree:{minArgs:1,maxArgs:1},getTree:{minArgs:0,maxArgs:0},move:{minArgs:2,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeTree:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}},browserAction:{disable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},enable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},getBadgeBackgroundColor:{minArgs:1,maxArgs:1},getBadgeText:{minArgs:1,maxArgs:1},getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},openPopup:{minArgs:0,maxArgs:0},setBadgeBackgroundColor:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setBadgeText:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},browsingData:{remove:{minArgs:2,maxArgs:2},removeCache:{minArgs:1,maxArgs:1},removeCookies:{minArgs:1,maxArgs:1},removeDownloads:{minArgs:1,maxArgs:1},removeFormData:{minArgs:1,maxArgs:1},removeHistory:{minArgs:1,maxArgs:1},removeLocalStorage:{minArgs:1,maxArgs:1},removePasswords:{minArgs:1,maxArgs:1},removePluginData:{minArgs:1,maxArgs:1},settings:{minArgs:0,maxArgs:0}},commands:{getAll:{minArgs:0,maxArgs:0}},contextMenus:{remove:{minArgs:1,maxArgs:1},removeAll:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},cookies:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:1,maxArgs:1},getAllCookieStores:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},devtools:{inspectedWindow:{eval:{minArgs:1,maxArgs:2,singleCallbackArg:!1}},panels:{create:{minArgs:3,maxArgs:3,singleCallbackArg:!0}}},downloads:{cancel:{minArgs:1,maxArgs:1},download:{minArgs:1,maxArgs:1},erase:{minArgs:1,maxArgs:1},getFileIcon:{minArgs:1,maxArgs:2},open:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},pause:{minArgs:1,maxArgs:1},removeFile:{minArgs:1,maxArgs:1},resume:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},extension:{isAllowedFileSchemeAccess:{minArgs:0,maxArgs:0},isAllowedIncognitoAccess:{minArgs:0,maxArgs:0}},history:{addUrl:{minArgs:1,maxArgs:1},deleteAll:{minArgs:0,maxArgs:0},deleteRange:{minArgs:1,maxArgs:1},deleteUrl:{minArgs:1,maxArgs:1},getVisits:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1}},i18n:{detectLanguage:{minArgs:1,maxArgs:1},getAcceptLanguages:{minArgs:0,maxArgs:0}},identity:{launchWebAuthFlow:{minArgs:1,maxArgs:1}},idle:{queryState:{minArgs:1,maxArgs:1}},management:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},getSelf:{minArgs:0,maxArgs:0},setEnabled:{minArgs:2,maxArgs:2},uninstallSelf:{minArgs:0,maxArgs:1}},notifications:{clear:{minArgs:1,maxArgs:1},create:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:0},getPermissionLevel:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},pageAction:{getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},hide:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},permissions:{contains:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},request:{minArgs:1,maxArgs:1}},runtime:{getBackgroundPage:{minArgs:0,maxArgs:0},getBrowserInfo:{minArgs:0,maxArgs:0},getPlatformInfo:{minArgs:0,maxArgs:0},openOptionsPage:{minArgs:0,maxArgs:0},requestUpdateCheck:{minArgs:0,maxArgs:0},sendMessage:{minArgs:1,maxArgs:3},sendNativeMessage:{minArgs:2,maxArgs:2},setUninstallURL:{minArgs:1,maxArgs:1}},sessions:{getDevices:{minArgs:0,maxArgs:1},getRecentlyClosed:{minArgs:0,maxArgs:1},restore:{minArgs:0,maxArgs:1}},storage:{local:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},managed:{get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1}},sync:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}}},tabs:{captureVisibleTab:{minArgs:0,maxArgs:2},create:{minArgs:1,maxArgs:1},detectLanguage:{minArgs:0,maxArgs:1},discard:{minArgs:0,maxArgs:1},duplicate:{minArgs:1,maxArgs:1},executeScript:{minArgs:1,maxArgs:2},get:{minArgs:1,maxArgs:1},getCurrent:{minArgs:0,maxArgs:0},getZoom:{minArgs:0,maxArgs:1},getZoomSettings:{minArgs:0,maxArgs:1},highlight:{minArgs:1,maxArgs:1},insertCSS:{minArgs:1,maxArgs:2},move:{minArgs:2,maxArgs:2},query:{minArgs:1,maxArgs:1},reload:{minArgs:0,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeCSS:{minArgs:1,maxArgs:2},sendMessage:{minArgs:2,maxArgs:3},setZoom:{minArgs:1,maxArgs:2},setZoomSettings:{minArgs:1,maxArgs:2},update:{minArgs:1,maxArgs:2}},topSites:{get:{minArgs:0,maxArgs:0}},webNavigation:{getAllFrames:{minArgs:1,maxArgs:1},getFrame:{minArgs:1,maxArgs:1}},webRequest:{handlerBehaviorChanged:{minArgs:0,maxArgs:0}},windows:{create:{minArgs:0,maxArgs:1},get:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:1},getCurrent:{minArgs:0,maxArgs:1},getLastFocused:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}}};if(0===Object.keys(f).length)throw new Error("api-metadata.json has not been included in browser-polyfill");class g extends WeakMap{constructor(v,w=void 0){super(w),this.createItem=v}get(v){return this.has(v)||this.set(v,this.createItem(v)),super.get(v)}}const h=v=>{return v&&"object"==typeof v&&"function"==typeof v.then},i=(v,w)=>{return(...x)=>{e.runtime.lastError?v.reject(e.runtime.lastError):w.singleCallbackArg||1>=x.length&&!1!==w.singleCallbackArg?v.resolve(x[0]):v.resolve(x)}},j=v=>1==v?"argument":"arguments",k=(v,w)=>{return function(y,...z){if(z.length<w.minArgs)throw new Error(`Expected at least ${w.minArgs} ${j(w.minArgs)} for ${v}(), got ${z.length}`);if(z.length>w.maxArgs)throw new Error(`Expected at most ${w.maxArgs} ${j(w.maxArgs)} for ${v}(), got ${z.length}`);return new Promise((A,B)=>{if(w.fallbackToNoCallback)try{y[v](...z,i({resolve:A,reject:B},w))}catch(C){console.warn(`${v} API method doesn't seem to support the callback parameter, `+"falling back to call it without a callback: ",C),y[v](...z),w.fallbackToNoCallback=!1,w.noCallback=!0,A()}else w.noCallback?(y[v](...z),A()):y[v](...z,i({resolve:A,reject:B},w))})}},l=(v,w,x)=>{return new Proxy(w,{apply(y,z,A){return x.call(z,v,...A)}})};let m=Function.call.bind(Object.prototype.hasOwnProperty);const n=(v,w={},x={})=>{let y=Object.create(null),z={has(B,C){return C in v||C in y},get(B,C){if(C in y)return y[C];if(C in v){let E=v[C];if("function"==typeof E){if("function"==typeof w[C])E=l(v,v[C],w[C]);else if(m(x,C)){let F=k(C,x[C]);E=l(v,v[C],F)}else E=E.bind(v);}else if("object"==typeof E&&null!==E&&(m(w,C)||m(x,C)))E=n(E,w[C],x[C]);else return Object.defineProperty(y,C,{configurable:!0,enumerable:!0,get(){return v[C]},set(F){v[C]=F}}),E;return y[C]=E,E}},set(B,C,D){return C in y?y[C]=D:v[C]=D,!0},defineProperty(B,C,D){return Reflect.defineProperty(y,C,D)},deleteProperty(B,C){return Reflect.deleteProperty(y,C)}},A=Object.create(v);return new Proxy(A,z)},o=v=>({addListener(w,x,...y){w.addListener(v.get(x),...y)},hasListener(w,x){return w.hasListener(v.get(x))},removeListener(w,x){w.removeListener(v.get(x))}});let p=!1;const q=new g(v=>{return"function"==typeof v?function(x,y,z){let B,D,A=!1,C=new Promise(G=>{B=function(H){p||(console.warn("Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)",new Error().stack),p=!0),A=!0,G(H)}});try{D=v(x,y,B)}catch(G){D=Promise.reject(G)}const E=!0!==D&&h(D);if(!0!==D&&!E&&!A)return!1;const F=G=>{G.then(H=>{z(H)},H=>{let I;I=H&&(H instanceof Error||"string"==typeof H.message)?H.message:"An unexpected error occurred",z({__mozWebExtensionPolyfillReject__:!0,message:I})}).catch(H=>{console.error("Failed to send onMessage rejected reply",H)})};return E?F(D):F(C),!0}:v}),r=({reject:v,resolve:w},x)=>{e.runtime.lastError?e.runtime.lastError.message==="The message port closed before a response was received."?w():v(e.runtime.lastError):x&&x.__mozWebExtensionPolyfillReject__?v(new Error(x.message)):w(x)},s=(v,w,x,...y)=>{if(y.length<w.minArgs)throw new Error(`Expected at least ${w.minArgs} ${j(w.minArgs)} for ${v}(), got ${y.length}`);if(y.length>w.maxArgs)throw new Error(`Expected at most ${w.maxArgs} ${j(w.maxArgs)} for ${v}(), got ${y.length}`);return new Promise((z,A)=>{const B=r.bind(null,{resolve:z,reject:A});y.push(B),x.sendMessage(...y)})},t={runtime:{onMessage:o(q),onMessageExternal:o(q),sendMessage:s.bind(null,"sendMessage",{minArgs:1,maxArgs:3})},tabs:{sendMessage:s.bind(null,"sendMessage",{minArgs:2,maxArgs:3})}},u={clear:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}};return f.privacy={network:{networkPredictionEnabled:u,webRTCIPHandlingPolicy:u},services:{passwordSavingEnabled:u},websites:{hyperlinkAuditingEnabled:u,referrersEnabled:u}},n(e,t,f)})(chrome)}else a.exports=browser});
//# sourceMappingURL=browser-polyfill.min.js.map

// webextension-polyfill v.0.4.0 (https://github.com/mozilla/webextension-polyfill)

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/***/ }),

/***/ "./src/background/actions/error.js":
/*!*****************************************!*\
  !*** ./src/background/actions/error.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ERROR_TYPES: () => (/* binding */ ERROR_TYPES),
/* harmony export */   sendError: () => (/* binding */ sendError),
/* harmony export */   sendOriginalNotFoundError: () => (/* binding */ sendOriginalNotFoundError)
/* harmony export */ });
/* harmony import */ var _shared_consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/consts */ "./src/shared/consts.js");
const browser = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");



const ERROR_TYPES = {
  ORIGINAL_NOT_FOUND: "ORIGINAL_NOT_FOUND",
};

const sendError = (tabId, text) => {
  console.error(e.message, " !!! error during downloading");
  browser.tabs.sendMessage(tabId, {
    type: _shared_consts__WEBPACK_IMPORTED_MODULE_0__.MESSAGES.ERROR,
    text,
    type,
  });
};

const sendOriginalNotFoundError = (tabId, originalHref) => {
  sendError(
    tabId,
    `Couldn't find an original image on ${originalHref}, thumbnail will be saved instead.`,
  );
};


/***/ }),

/***/ "./src/background/actions/index.js":
/*!*****************************************!*\
  !*** ./src/background/actions/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getImageUrlFromNextPage: () => (/* binding */ getImageUrlFromNextPage),
/* harmony export */   getSpecialRule: () => (/* binding */ getSpecialRule),
/* harmony export */   openSettings: () => (/* binding */ openSettings),
/* harmony export */   runUserScript: () => (/* binding */ runUserScript),
/* harmony export */   saveAllOriginalImagesRaw: () => (/* binding */ saveAllOriginalImagesRaw),
/* harmony export */   saveContent: () => (/* binding */ saveContent),
/* harmony export */   sendDownloadingProgress: () => (/* binding */ sendDownloadingProgress),
/* harmony export */   stopDownloading: () => (/* binding */ stopDownloading)
/* harmony export */ });
/* harmony import */ var _shared_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/state */ "./src/shared/state.js");
/* harmony import */ var _shared_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/consts */ "./src/shared/consts.js");
/* harmony import */ var _shared_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/helpers */ "./src/shared/helpers.js");
/* harmony import */ var _error__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./error */ "./src/background/actions/error.js");
const browser = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");






const SETTINGS_PAGE_URL = "/options/options.html";

async function runUserScript(newActiveState, newSaveMethod, tab) {
  if (!tab) {
    tab = await (0,_shared_helpers__WEBPACK_IMPORTED_MODULE_2__.getCurrentTab)();
  }

  if (!(0,_shared_helpers__WEBPACK_IMPORTED_MODULE_2__.isHTTPUrl)(tab.url)) {
    return !newActiveState;
  }

  let executeScriptPromise = Promise.resolve();
  let sendMessage = () => {};

  const stateOnTab = _shared_state__WEBPACK_IMPORTED_MODULE_0__["default"].tabState(tab.id);
  if (!stateOnTab || stateOnTab.url !== tab.url) {
    if (!_shared_state__WEBPACK_IMPORTED_MODULE_0__["default"].active() && !newActiveState) {
      return false;
    }

    executeScriptPromise = (0,_shared_helpers__WEBPACK_IMPORTED_MODULE_2__.executeScript)(tab.id, _shared_consts__WEBPACK_IMPORTED_MODULE_1__.SCRIPTS.PAGE);
  }

  if (
    !stateOnTab ||
    stateOnTab.url !== tab.url ||
    stateOnTab.active !== newActiveState ||
    stateOnTab.saveMethod !== newSaveMethod
  ) {
    sendMessage = () =>
      browser.tabs.sendMessage(tab.id, {
        action: "switchClickHandler",
        active: newActiveState,
        saveMethod: newSaveMethod,
        specialCases: _shared_state__WEBPACK_IMPORTED_MODULE_0__["default"].specialRules(),
      });
  }

  _shared_state__WEBPACK_IMPORTED_MODULE_0__["default"].tabState(tab.id, {
    id: tab.id,
    active: newActiveState,
    saveMethod: newSaveMethod,
    url: tab.url,
  });

  executeScriptPromise.then(sendMessage);
  return newActiveState;
}

async function saveContent(message) {
  const {
    title,
    thumbUrl,
    href,
    originalUrl,
    originalHref,
    originalTitle,
    isPreloaded,
    tabId,
    isFromGallery,
    isFromSpecialCase,
  } = message;
  const [, , S_ORIGINAL_SELECTOR, S_NAMING, S_FOLDER_NAME] = getSpecialRule(
    href,
    _shared_state__WEBPACK_IMPORTED_MODULE_0__["default"].specialRules(),
  );
  const tryOriginal = _shared_state__WEBPACK_IMPORTED_MODULE_0__["default"].tryOriginal();
  const isValidOriginalHref =
    originalHref &&
    originalHref.length &&
    originalHref !== "null";

  if (
    !originalUrl &&
    !isFromSpecialCase &&
    isValidOriginalHref &&
    !isPreloaded &&
    S_ORIGINAL_SELECTOR &&
    (tryOriginal || isFromGallery)
  ) {
    try {
      await getImageUrlFromNextPage({
        title,
        href,
        thumbUrl,
        originalHref,
        imageSelector: S_ORIGINAL_SELECTOR,
        reason: _shared_consts__WEBPACK_IMPORTED_MODULE_1__.EXTRACTION_REASON.DOWNLOAD,
      });
    } catch (e) {
      console.error(e);
    }
    return;
  }

  const saveFolder = `${_shared_state__WEBPACK_IMPORTED_MODULE_0__["default"].saveFolder()}/${S_FOLDER_NAME}/`.replace(
    /\/+/g,
    "/",
  );

  const fileExtension = (0,_shared_helpers__WEBPACK_IMPORTED_MODULE_2__.extractExtension)(
    originalUrl || thumbUrl,
  );

  let [downloadUrl, extension] = [thumbUrl, fileExtension];

  if ((isFromGallery || tryOriginal) && !S_ORIGINAL_SELECTOR && isValidOriginalHref) {
    [downloadUrl, extension] = [originalHref, (0,_shared_helpers__WEBPACK_IMPORTED_MODULE_2__.extractExtension)(originalHref)];
  }

  if (originalUrl) {
    [downloadUrl, extension] = [originalUrl, fileExtension];
  }

  const [name] = (0,_shared_helpers__WEBPACK_IMPORTED_MODULE_2__.getFileName)({
    ...message,
    naming: S_NAMING || _shared_state__WEBPACK_IMPORTED_MODULE_0__["default"].saveNaming(),
  });
  const fileName = `${saveFolder}${name}.${extension}`;

  try {
    await download(downloadUrl, fileName);
  } catch (e) {
    (0,_error__WEBPACK_IMPORTED_MODULE_3__.sendOriginalNotFoundError)(tabId, originalHref);
    await download(thumbUrl, fileName);
  }
}

async function saveAllOriginalImagesRaw(message) {
  _shared_state__WEBPACK_IMPORTED_MODULE_0__["default"].isDownloadingInProgress(true);

  for (let i = 0; i < message.urls.length; i++) {
    const { thumbUrl, originalHref, isPreloaded } = message.urls[i];

    if (_shared_state__WEBPACK_IMPORTED_MODULE_0__["default"].isDownloadingInProgress()) {
      await saveContent({
        ...message,
        thumbUrl,
        originalHref,
        type: _shared_consts__WEBPACK_IMPORTED_MODULE_1__.MESSAGES.SAVE_CONTENT,
        isPreloaded,
        isFromGallery: true,
        tabId: message.tabId,
      });
      await sendDownloadingProgress(
        message.tabId,
        i + 1,
        `${_shared_consts__WEBPACK_IMPORTED_MODULE_1__.DOWNLOAD_STATUS.DOWNLAODING}${originalHref}`,
      );
    }
  }
  sendDownloadingProgress(message.tabId, 0);
  _shared_state__WEBPACK_IMPORTED_MODULE_0__["default"].isDownloadingInProgress(false);
}

async function stopDownloading() {
  _shared_state__WEBPACK_IMPORTED_MODULE_0__["default"].isDownloadingInProgress(false);
  const tab = await (0,_shared_helpers__WEBPACK_IMPORTED_MODULE_2__.getCurrentTab)();
  sendDownloadingProgress(tab.id, 0);
}

async function sendDownloadingProgress(tabId, count, filename) {
  await browser.tabs.sendMessage(tabId, {
    type: _shared_consts__WEBPACK_IMPORTED_MODULE_1__.MESSAGES.RECEIVE_DOWNLOADING_PROGRESS,
    count,
    filename,
  });
}

async function download(url, filename) {
  await browser.downloads.download({ url, saveAs: false, filename });
}

async function getImageUrlFromNextPage(message)
 {
  const newTab = await browser.tabs.create({
    url: message.originalHref,
    active: false,
  });

  await (0,_shared_helpers__WEBPACK_IMPORTED_MODULE_2__.executeScript)(newTab.id, _shared_consts__WEBPACK_IMPORTED_MODULE_1__.SCRIPTS.DOWNLOAD_ORIGINAL_IMAGE_URL);
  await browser.tabs.sendMessage(newTab.id, {
    ...message,
    tabWithOriginId: newTab.id,
  });
}

function getSpecialRule(url, specialRules) {
  for (const params of specialRules) {
    if (url.startsWith(params[0])) {
      return params;
    }
  }

  return [];
}

function openSettings() {
  browser.tabs.create({ active: true, url: SETTINGS_PAGE_URL });
}


/***/ }),

/***/ "./src/page/index.js":
/*!***************************!*\
  !*** ./src/page/index.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _background_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../background/actions */ "./src/background/actions/index.js");
/* harmony import */ var _shared_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/consts */ "./src/shared/consts.js");
const browser = __webpack_require__(/*! webextension-polyfill/dist/browser-polyfill.min */ "./node_modules/webextension-polyfill/dist/browser-polyfill.min.js");




function init () {
  if (!window.hasRun) {
    window.hasRun = true;
    browser.runtime.onMessage.addListener(onMessage);
  }
}

function onMessage (message) {
  switch (message.type) {
    case _shared_consts__WEBPACK_IMPORTED_MODULE_1__.MESSAGES.RECEIVE_IMAGES_URLS:
      break;

    default:
      switchClickHandler(message);
      window.saveMethod = message.saveMethod;
      window.specialRules = message.specialCases;
  }
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

  const { thumbUrl, originalHref } = extractSrc(e.target);
  if (thumbUrl || originalHref) {
    browser.runtime.sendMessage({
      type: _shared_consts__WEBPACK_IMPORTED_MODULE_1__.MESSAGES.RECEIVE_ORIGINAL_URL,
      title: document.title,
      thumbUrl,
      originalHref,
      href: document.location.href,
      reason: _shared_consts__WEBPACK_IMPORTED_MODULE_1__.EXTRACTION_REASON.DOWNLOAD,
    });
  }
}

function extractSrc (el) {
  let url;

  const testEl = document.createElement(el.tagName);
  const possibleSources = el.querySelectorAll('source');
  if (possibleSources.length) {
    for (let i = 0; i < possibleSources.length; i++) {
      const source = possibleSources[i];

      if (!!testEl.canPlayType(source.type)) {
        url = source.src;
        break;
      }
    }

    if (!url) {
      url = possibleSources[0].src;
    }
  } else {
    url = el.src;
  }

  const a = el.closest("a");
  const originalHref = a && a.href;

  return { thumbUrl: url, originalHref };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (init);

/***/ }),

/***/ "./src/shared/consts.js":
/*!******************************!*\
  !*** ./src/shared/consts.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CHARACTERS: () => (/* binding */ CHARACTERS),
/* harmony export */   COLLECTING_REASON: () => (/* binding */ COLLECTING_REASON),
/* harmony export */   DEBUG_FILENAME: () => (/* binding */ DEBUG_FILENAME),
/* harmony export */   DOWNLOAD_STATUS: () => (/* binding */ DOWNLOAD_STATUS),
/* harmony export */   ERRORS: () => (/* binding */ ERRORS),
/* harmony export */   EXTENSION_NAME: () => (/* binding */ EXTENSION_NAME),
/* harmony export */   EXTRACTION_REASON: () => (/* binding */ EXTRACTION_REASON),
/* harmony export */   IMAGES_GALLERY_URL: () => (/* binding */ IMAGES_GALLERY_URL),
/* harmony export */   LOADING_ERROR_ADVICE: () => (/* binding */ LOADING_ERROR_ADVICE),
/* harmony export */   MAX_FILE_NAME: () => (/* binding */ MAX_FILE_NAME),
/* harmony export */   MESSAGES: () => (/* binding */ MESSAGES),
/* harmony export */   SCRIPTS: () => (/* binding */ SCRIPTS)
/* harmony export */ });
const EXTENSION_NAME = "clickloader";

const MESSAGES = {
  SAVE_CONTENT: "SAVE_CONTENT",
  GET_PICTURE_URLS: "GET_PICTURE_URLS",
  RECEIVE_IMAGES_URLS: "RECEIVE_IMAGES_URLS",
  IMAGES_GALLERY_COMPLETED: "IMAGES_GALLERY_COMPLETED",
  SAVE_ALL_CONTENT_RAW: "SAVE_ALL_CONTENT_RAW",
  GET_IMAGE_URL_FOR_GALLERY: "GET_IMAGE_URL_FOR_GALLERY",
  RECEIVE_ORIGINAL_URL: "RECEIVE_ORIGINAL_URL",
  RECEIVE_ORIGINAL_IMAGE_URL: "RECEIVE_ORIGINAL_IMAGE_URL",
  RECEIVE_DOWNLOADING_PROGRESS: "RECEIVE_DOWNLOADING_PROGRESS",
  STOP_DOWNLOADING: "STOP_DOWNLOADING",
  GET_ALL_IMAGES_URLS_FOR_GALLERY: "GET_ALL_IMAGES_URLS_FOR_GALLERY",
  RECEIVE_PRELOADED_IMAGES_URLS: "RECEIVE_PRELOADED_IMAGES_URLS",
  OPEN_SETTINGS: "OPEN_SETTINGS",
  ERROR: "ERROR",
};

const COLLECTING_REASON = {
  FOR_GALLERY: "FOR_GALLERY",
  DOWNLOAD_ON_SITE_RAW: "DOWNLOAD_ON_SITE_RAW",
  DOWNLOAD_ON_SITE_AS_ARCHIVE: "DOWNLOAD_ON_SITE_AS_ARCHIVE",
}

const EXTRACTION_REASON = {
  DOWNLOAD: "DOWNLOAD",
  COLLECT_ORIGINAL_URLS: "COLLECT_ORIGINAL_URLS",
  GET_ORIGINAL_URL: "GET_ORIGINAL_URL",
};

const MAX_FILE_NAME = 100;

const SCRIPTS = {
  PAGE: "/page-script.js",
  EXTRACT_ALL_IMAGES_URLS: "/extract-all-images-urls.js",
  DOWNLOAD_ORIGINAL_IMAGE_URL: "/download-original-special-case.js",
};

const IMAGES_GALLERY_URL = "/images-gallery/index.html";

const ERRORS = {
  INVALID_URL: "Invalid URL",
};

const CHARACTERS = {
  TAB: "\t",
  NL: "\n",
};

const DEBUG_FILENAME = "image_urls.txt";

const DOWNLOAD_STATUS = {
  DOWNLAODING: "Downloading: ",
  PREPARING: "Preparing: ",
}

const LOADING_ERROR_ADVICE =
  "(Try downloading from the gallery. Browser console may have more information)";


/***/ }),

/***/ "./src/shared/helpers.js":
/*!*******************************!*\
  !*** ./src/shared/helpers.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSafeFolderName: () => (/* binding */ createSafeFolderName),
/* harmony export */   executeScript: () => (/* binding */ executeScript),
/* harmony export */   extractExtension: () => (/* binding */ extractExtension),
/* harmony export */   extractKeys: () => (/* binding */ extractKeys),
/* harmony export */   getCurrentTab: () => (/* binding */ getCurrentTab),
/* harmony export */   getFileName: () => (/* binding */ getFileName),
/* harmony export */   isHTTPUrl: () => (/* binding */ isHTTPUrl),
/* harmony export */   isMediaResource: () => (/* binding */ isMediaResource),
/* harmony export */   isValidUrl: () => (/* binding */ isValidUrl),
/* harmony export */   isVideo: () => (/* binding */ isVideo),
/* harmony export */   removeForbiddenCharacters: () => (/* binding */ removeForbiddenCharacters)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./src/shared/consts.js");
const browser = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");



function removeForbiddenCharacters (str) {
  const regexpStr = [
    '[\\\\\?%*:|"<>',
    '\\/' , '\\.',
    ']'
  ].join('');

  const regexp = new RegExp(regexpStr, 'g');
  return str.replace(regexp, '_');
}

function getCurrentTab () {
  return browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => tabs[0]);
}

function isHTTPUrl (url) {
  return url.indexOf('http') === 0;
}

function extractExtension (url) {
  return url.split(".").slice(-1)[0].split("?")[0].split("/")[0];
}

function isVideo (url) {
  const extension = extractExtension(url);

  return ["mp4", "webm", "mov"].includes(extension);
}

async function executeScript (tabId, file) {
  try {
    return await browser.scripting.executeScript({
      target: {
        tabId
      },
      files: [file],
    });
  } catch (e) {
    return await browser.tabs.executeScript(tabId, { file });
  }
}

function isValidUrl (url) {
  return url && url !== null && url.length && url !== "null";
}

function createSafeFolderName (string) {
  let folderName = removeForbiddenCharacters(string)
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "");

  return folderName;
}

function isMediaResource (url, domainName) {
  return domainName.length && url.slice(domainName.length).split(".")[1] || url.split(".").length > 3;
}

function extractOriginalFileName (url) {
  return url.split("/").slice(-1)[0].split(".")[0];
}

function getFileName (pictureData, idx) {
  const { thumbUrl, originalUrl, originalHref, origin, title, href, naming } = pictureData;

  const downloadUrl =
      originalUrl && isMediaResource(originalUrl, origin)
        ? originalUrl
        : thumbUrl;

  const name =
    naming === "URL"
      ? href
      : naming === "Original"
        ? extractOriginalFileName(originalUrl || originalHref)
        : title;

  const number = naming !== "Original" && idx ? ` (${idx})` : "";

  const fileName = `${removeForbiddenCharacters(name).substring(0, _consts__WEBPACK_IMPORTED_MODULE_0__.MAX_FILE_NAME)}${number}`;

  return [fileName, downloadUrl];
}

function extractKeys (obj, keys) {
  const newObj = {};

  for (let key in obj) {
    if (keys.includes(key)) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}


/***/ }),

/***/ "./src/shared/state.js":
/*!*****************************!*\
  !*** ./src/shared/state.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const browser = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");

const EXTENSION_NAME = 'Save on Click';

const DEFAULT_SETTINGS = {
  saveFolder: EXTENSION_NAME + '/',
  saveMethod: 'contextmenu',
  saveNaming: 'Title',
  saveFolders: ['', EXTENSION_NAME + '/']
};

const STATE = {
  tabs: {},
  active: false,
  saveFolders: [],
  saveFolder: "",
  saveMethod: "",
  saveNaming: "",
  tryOriginal: false,
  savedOriginalUrls: [],
  specialRules: [
    ["", "", "", "", ""],
  ],
};

const contextMenuKeys = [
  "active",
  "saveFolders",
  "saveFolder",
  "saveMethod",
  "saveNaming",
  "tryOriginal",
  "galleryImagesTab",
  "galleryData",
  "specialRules",
  "savedOriginalUrls",
  "isGalleryImagesSpecialRule",
  "thumbsCount",
  "isNoThumbCase",
  "isDownloadingInProgress",
  "isPreloadingForGallery",
];

const accessors = {};

contextMenuKeys.forEach((stateName) => {

  accessors[stateName] = (value) => {
    if (typeof value !== 'undefined') {
      STATE[stateName] = value;
    }
  
    return STATE[stateName];
  };

});

accessors.tabState = tabState;

function tabState (tabId, tab) {
  if (typeof tab !== 'undefined') {
    STATE.tabs[tabId] = tab;
  }

  return STATE.tabs[tabId];
}

function get (keys) {
  const values = {};

  keys.forEach((key) => {
    values[key] = accessors[key]();
  });

  return values;
}

function getContextMenuState () {
  return get(contextMenuKeys);
}

function rootFolder () {
  return DEFAULT_SETTINGS.saveFolders[0];
}

async function loadSettings () {
  const savedOptions = await browser.storage.local.get();
  
  for (let key in DEFAULT_SETTINGS) {
    if (typeof savedOptions[key] === 'undefined') {
      savedOptions[key] = DEFAULT_SETTINGS[key];
    }
  }

  Object.assign(STATE, savedOptions);
  return STATE;
}

function updateFromStorage (storageChanges) {
  for (let key in storageChanges) {
    STATE[key] = storageChanges[key].newValue;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ...accessors,
  loadSettings,
  getContextMenuState,
  rootFolder,
  updateFromStorage,
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
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
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
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
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
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!****************************!*\
  !*** ./src/page-script.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _page_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./page/index */ "./src/page/index.js");


(0,_page_index__WEBPACK_IMPORTED_MODULE_0__["default"])();

})();

/******/ })()
;