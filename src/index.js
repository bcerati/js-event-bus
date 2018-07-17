(function (caller, bus) {
  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = bus();
  } else if (typeof exports === 'object') {
    exports.EventBus = bus();
  } else {
    caller.EventBus = bus();
  }
})(this, function () {
  var EventBus = function () {
    this.listeners = {};

    this.registerListener = function (event, callback, number) {
      var type = event.constructor.name;
      number = this.validateNumber(number || 'any');
  
      if (type !== 'Array') {
        event = [event];
      }

      event.forEach(function (e) {
        if (e.constructor.name !== 'String') {
          throw new Error('Only `String` and array of `String` are accepted for the event names!');
        }
  
        that.listeners[e] = that.listeners[e] || [];
        that.listeners[e].push({
          callback: callback,
          number: number
        });
  
      });
    };

    this.validateNumber = function (n) {
      var type = n.constructor.name;

      if (type === 'Number') {
        return n;
      } else if (type === 'String' && n.toLowerCase() === 'any') {
        return 'any';
      }

      throw new Error('Only `Number` and `any` are accepted in the number of possible executions!');
    };

    this.toBeRemoved = function (info) {
      var number = info.number;
      info.execution = info.execution || 0;
      info.execution++;

      if (number === 'any' || info.execution < number) {
        return false;
      }

      return true;
    };

    var that = this;
    return {
      on: function (event, callback) {
        that.registerListener.bind(that)(event, callback, 'any');
      },

      once: function (event, callback) {
        that.registerListener.bind(that)(event, callback, 1);
      },

      exactly: function (number, event, callback) {
        that.registerListener.bind(that)(event, callback, number);
      },

      emit: function (eventName, context) {
        var listeners = that.listeners[eventName] || [];
        var parentArgs = arguments;

        context = context || this;
        listeners.forEach(function (info, index) {
          var callback = info.callback;
          var number = info.number;

          if (context) {
            callback = callback.bind(context);
          }

          var args = [];
          Object
            .keys(parentArgs)
            .map(function (i) {
              if (i > 1) {
                args.push(parentArgs[i]);
              }
            });

          if (that.toBeRemoved(info)) {
            that.listeners[eventName].splice(index, 1);
          }

          callback.apply(null, args);
        });
      }
    };
  };

  return EventBus;
});