"use strict";
exports.__esModule = true;
var EventBus = /** @class */ (function () {
    function EventBus() {
        this.listeners = {};
    }
    // creates an event that can be triggered any number of times
    EventBus.prototype.on = function (eventName, callback) {
        this.registerListener(eventName, callback);
    };
    // creates an event that can be triggered only once. If it is emitted twice, the callback will only be executed once!
    EventBus.prototype.once = function (eventName, callback) {
        this.registerListener(eventName, callback, 1);
    };
    // creates an event that can be triggered only a number of times. If it is emitted more than that, the callback will not be be executed anymore!
    EventBus.prototype.exactly = function (eventName, callback, capacity) {
        this.registerListener(eventName, callback, capacity);
    };
    // kill an event with all it's callbacks
    EventBus.prototype.die = function (eventName) {
        delete this.listeners[eventName];
    };
    // kill an event with all it's callbacks
    EventBus.prototype.off = function (eventName) {
        this.die(eventName);
    };
    // removes the given callback for the given event
    EventBus.prototype.detach = function (eventName, callback) {
        var listeners = this.listeners[eventName] || [];
        listeners = listeners.filter(function (value) {
            return value.callback !== callback;
        });
        if (eventName in this.listeners) {
            this.listeners[eventName] = listeners;
        }
    };
    // removes all the events for the given name
    EventBus.prototype.detachAll = function (eventName) {
        this.die(eventName);
    };
    EventBus.prototype.emit = function (eventName, context) {
        var _this = this;
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var listeners = [];
        // name exact match
        if (this.hasListeners(eventName)) {
            listeners = this.listeners[eventName];
        }
        else if (eventName.includes('*')) {
            // wildcards support
            var newName = eventName.replace(/\*\*/, '([^.]+.?)+');
            newName = newName.replace(/\*/g, '[^.]+');
            var match = eventName.match(newName);
            if (match && eventName === match[0]) {
                listeners = this.listeners[eventName];
            }
        }
        listeners.forEach(function (listener, k) {
            var callback = listener.callback;
            if (context) {
                callback = callback.bind(context);
            }
            callback.apply(void 0, args);
            if (listener.triggerCapacity !== undefined) {
                listener.triggerCapacity--;
                listeners[k].triggerCapacity = listener.triggerCapacity;
            }
            if (_this.checkToRemoveListener(listener)) {
                _this.listeners[eventName].splice(k, 1);
            }
        });
    };
    EventBus.prototype.registerListener = function (eventName, callback, triggerCapacity) {
        if (!this.hasListeners(eventName)) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push({ callback: callback, triggerCapacity: triggerCapacity });
    };
    EventBus.prototype.checkToRemoveListener = function (eventInformation) {
        if (eventInformation.triggerCapacity !== undefined) {
            return eventInformation.triggerCapacity <= 0;
        }
        return false;
    };
    EventBus.prototype.hasListeners = function (eventName) {
        return eventName in this.listeners;
    };
    return EventBus;
}());
exports["default"] = EventBus;
