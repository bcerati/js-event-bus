"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EventBus = /*#__PURE__*/function () {
  function EventBus() {
    _classCallCheck(this, EventBus);

    _defineProperty(this, "listeners", {});
  }

  _createClass(EventBus, [{
    key: "on",
    value: // creates an event that can be triggered any number of times
    function on(eventName, callback) {
      this.registerListener(eventName, callback);
    } // creates an event that can be triggered only once. If it is emitted twice, the callback will only be executed once!

  }, {
    key: "once",
    value: function once(eventName, callback) {
      this.registerListener(eventName, callback, 1);
    } // creates an event that can be triggered only a number of times. If it is emitted more than that, the callback will not be be executed anymore!

  }, {
    key: "exactly",
    value: function exactly(eventName, callback, capacity) {
      this.registerListener(eventName, callback, capacity);
    } // kill an event with all it's callbacks

  }, {
    key: "die",
    value: function die(eventName) {
      delete this.listeners[eventName];
    } // kill an event with all it's callbacks

  }, {
    key: "off",
    value: function off(eventName) {
      this.die(eventName);
    } // removes the given callback for the given event

  }, {
    key: "detach",
    value: function detach(eventName, callback) {
      var listeners = this.listeners[eventName] || [];
      listeners = listeners.filter(function (value) {
        return value.callback !== callback;
      });

      if (eventName in this.listeners) {
        this.listeners[eventName] = listeners;
      }
    } // removes all the events for the given name

  }, {
    key: "detachAll",
    value: function detachAll(eventName) {
      this.die(eventName);
    }
  }, {
    key: "emit",
    value: function emit(eventName, context) {
      var _this = this;

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      var listeners = []; // name exact match

      if (this.hasListeners(eventName)) {
        listeners = this.listeners[eventName];
      } else if (eventName.includes('*')) {
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
    }
  }, {
    key: "registerListener",
    value: function registerListener(eventName, callback, triggerCapacity) {
      if (!this.hasListeners(eventName)) {
        this.listeners[eventName] = [];
      }

      this.listeners[eventName].push({
        callback: callback,
        triggerCapacity: triggerCapacity
      });
    }
  }, {
    key: "checkToRemoveListener",
    value: function checkToRemoveListener(eventInformation) {
      if (eventInformation.triggerCapacity !== undefined) {
        return eventInformation.triggerCapacity <= 0;
      }

      return false;
    }
  }, {
    key: "hasListeners",
    value: function hasListeners(eventName) {
      return eventName in this.listeners;
    }
  }]);

  return EventBus;
}();

var _default = EventBus;
exports["default"] = _default;