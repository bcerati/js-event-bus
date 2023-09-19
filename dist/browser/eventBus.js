/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 539:
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (factory) {
    if ( true && typeof module.exports === "object") {
        var v = factory(__webpack_require__(875), exports);
        if (v !== undefined) module.exports = v;
    }
    else if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = exports.EventBus = void 0;
    class EventBus {
        constructor() {
            // Memory storage for all the events
            this.listeners = {};
        }
        // creates an event that can be triggered any number of times
        /**
         * creates an event that can be triggered any number of times
         * @method on
         * @param {string} eventName - The name of the event
         * @param {function} callback - The callback to execute
         * @return {void}
         * @example eventBus.on('event.name', function() { console.log('event.name was triggered') })
         */
        on(eventName, callback) {
            this.registerListener(eventName, callback);
        }
        /**
         * creates an event that can be triggered only once. If it is emitted twice, the callback will only be executed once!
         * @method once
         * @param {string} eventName - The name of the event
         * @param {function} callback - The callback to execute
         * @return {void}
         * @example eventBus.once('event.name', function() { console.log('event.name was triggered only once') })
         */
        once(eventName, callback) {
            this.registerListener(eventName, callback, 1);
        }
        /**
         * reates an event that can be triggered only a number of times. If it is emitted more than that, the callback will not be be executed anymore!
         * @method exactly
         * @param {string} eventName - The name of the event
         * @return {void}
         * @example eventBus.exactly('event.name', function() { console.log('event.name was triggered 3 times') }, 3)
         */
        exactly(eventName, callback, capacity) {
            this.registerListener(eventName, callback, capacity);
        }
        /**
         * kill an event with all it's callbacks
         * @method off
         * @param {string} eventName - The name of the event
         * @return {void}
         * @example eventBus.off('event.name')
         */
        off(eventName) {
            delete this.listeners[eventName];
        }
        /**
         * removes the given callback for the given event
         * @method detach
         * @param {string} eventName - The name of the event
         * @param {function} callback - The callback to remove
         * @return {void|boolean} - Returns true if the event was found and removed, void otherwise
         * @example eventBus.detach('event.name', callback)
         */
        detach(eventName, callback) {
            const listeners = this.listeners[eventName] || [];
            const filteredListeners = listeners.filter(function (value) {
                return value.callback !== callback;
            });
            if (eventName in this.listeners) {
                this.listeners[eventName] = filteredListeners;
                return true; // Event was found and removed
            }
            return false; // Event was not found
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        /**
         * emits an event with the given name and arguments
         * @param {string} eventName - The name of the event
         * @param {any} args - The arguments to pass to the callback
         * @return {void}
         * @use {__context: this|Instance} to pass the context to the callback
         * @example eventBus.emit('event.name', arg1, arg2, arg3)
         * @example eventBus.emit('event.name', arg1, arg2, arg3, {__context: YourInstance})
         */
        emit(eventName, ...args) {
            let queueListeners = [];
            let matches = null;
            let allArgs = this.extractContextFromArgs(args);
            let context = allArgs[0];
            args = allArgs[1];
            // name exact match
            if (this.hasListener(eventName)) {
                queueListeners = this.listeners[eventName];
            }
            else {
                // -----------------------------------------
                // Wildcard support
                if (eventName.includes('*')) {
                    // case 1, if the incoming string has * or ** in it
                    // which will suppport emit("name*") or emit("name**") or emit("name.*name**")
                    matches = this.patternSearch(eventName, Object.keys(this.listeners));
                    if (matches) {
                        matches.forEach((match) => {
                            queueListeners = queueListeners.concat(this.listeners[match]);
                        });
                    }
                }
                else {
                    // case 2, if the incoming string matches a registered pattern
                    // which will support on("name*") | on("name**") | on("name.*name**")
                    for (const key in this.listeners) {
                        matches = this.patternSearch(key, [eventName]);
                        if (matches) {
                            matches.forEach((match) => {
                                queueListeners = queueListeners.concat(this.listeners[key]);
                            });
                        }
                    }
                }
            }
            queueListeners.forEach((listener, k) => {
                let callback = listener.callback;
                if (context) {
                    callback = callback.bind(context);
                }
                callback(...args);
                if (listener.triggerCapacity !== undefined) {
                    listener.triggerCapacity--;
                    queueListeners[k].triggerCapacity = listener.triggerCapacity;
                }
                if (this.checkToRemoveListener(listener)) {
                    this.listeners[eventName].splice(k, 1);
                }
            });
        }
        /**
         * Search for a pattern in a list of strings
         * @method patternSearch
         * @private
         * @param {string} pattern - The pattern to search for
         * @param {string[]} list - The list of strings to search in
         * @return {string[]|null} - Returns a list of strings that match the pattern, or null if no match is found
         * @example patternSearch('name.*', ['name.a', 'name.b', 'name.c']) // returns ['name.a', 'name.b', 'name.c']
         */
        patternSearch(pattern, list) {
            let filteredList = [];
            // console.log('__testLogHere__', pattern, this.setWildCardString(pattern));
            const regex = new RegExp(this.setWildCardString(pattern));
            filteredList = list.filter((item) => regex.test(item));
            return filteredList.length === 0 ? null : filteredList;
        }
        setWildCardString(string) {
            let regexStr = string.replace(/([.+?^${}()|\[\]\/\\])/g, '\\$&'); // escape all regex special chars
            regexStr = regexStr
                .replace(/\*\*/g, '[_g_]') // Replace wildcard patterns with temporary markers
                .replace(/\*/g, '(.*?)')
                .replace(/\[_g_\]/g, '.*');
            return `^${regexStr}$`;
        }
        /**
         * Get a list of listeners based on a pattern
         * @method getListernerByPattern
         * @private
         * @param {string} pattern - The pattern to search for
         * @return {ListenerType[]|null} - Returns a list of listeners that match the pattern, or null if no match is found
         */
        getListernerByPattern(pattern) {
            let listeners = null;
            Object.keys(this.listeners).forEach((key) => {
                if (key.includes(pattern)) {
                    listeners = this.listeners[key];
                }
            });
            return listeners;
        }
        /**
         * Extract the context from the arguments
         * @method extractContextFromArgs
         * @private
         * @param {any[]} args - The arguments to extract the context from
         * @return {any[]} - Returns an array with the context as the first element and the arguments as the second element
         */
        extractContextFromArgs(args) {
            let context = null;
            for (let i = 0; i < args.length; i++) {
                const arg = args[i];
                if (arg && typeof arg === 'object' && arg.hasOwnProperty('__context')) {
                    context = arg.__context;
                    args.splice(i, 1);
                    break;
                }
            }
            return [context, args];
        }
        registerListener(eventName, callback, triggerCapacity) {
            if (!this.hasListener(eventName)) {
                this.listeners[eventName] = [];
            }
            this.listeners[eventName].push({ callback, triggerCapacity });
        }
        checkToRemoveListener(eventInformation) {
            if (eventInformation.triggerCapacity !== undefined) {
                return eventInformation.triggerCapacity <= 0;
            }
            return false;
        }
        hasListener(eventName) {
            return eventName in this.listeners;
        }
    }
    exports.EventBus = EventBus;
    exports.default = EventBus;
});


/***/ }),

/***/ 875:
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 875;
module.exports = webpackEmptyContext;

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(539);
/******/ 	var __webpack_export_target__ = window;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;