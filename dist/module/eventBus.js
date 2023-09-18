(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
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
         * @param {any} context - The context to bind the callback to
         * @param {any} args - The arguments to pass to the callback
         * @return {void}
         * @example eventBus.emit('event.name', this, arg1, arg2, arg3)
         */
        emit(eventName, context, ...args) {
            let listeners = [];
            // name exact match
            if (this.hasListeners(eventName)) {
                listeners = this.listeners[eventName];
            }
            else if (eventName.includes('*')) {
                // wildcards support
                let newName = eventName.replace(/\*\*/, '([^.]+.?)+');
                newName = newName.replace(/\*/g, '[^.]+');
                const match = eventName.match(newName);
                if (match && eventName === match[0]) {
                    listeners = this.listeners[eventName];
                }
            }
            listeners.forEach((listener, k) => {
                let callback = listener.callback;
                if (context) {
                    callback = callback.bind(context);
                }
                callback(...args);
                if (listener.triggerCapacity !== undefined) {
                    listener.triggerCapacity--;
                    listeners[k].triggerCapacity = listener.triggerCapacity;
                }
                if (this.checkToRemoveListener(listener)) {
                    this.listeners[eventName].splice(k, 1);
                }
            });
        }
        registerListener(eventName, callback, triggerCapacity) {
            if (!this.hasListeners(eventName)) {
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
        hasListeners(eventName) {
            return eventName in this.listeners;
        }
    }
    exports.EventBus = EventBus;
    exports.default = EventBus;
});
