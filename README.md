# js-event-bus
Simple Event Bus library built for any JavaScript application.

## Installation

### Using npm
```
npm i js-event-bus --save
```

### Using yarn
```
yarn add js-event-bus
```

## Usage
This library was built so you can use it in any JS application like Node.js apps, browser apps etc. The API is always the same.

### Importing in Node.js application
If you want to use it in your Node.js apps you can import the library like this:

```js
const eventBus = require('js-event-bus')();
```

### Importing in browser application
If you want to use it in your Browser apps you can import the library like this:

```html
<body>

  <div>Put your content here</div>

  <script src="/lib/js-event-bus/lib/js-event-bus.min.js"></script>
  <script>
    const eventBus = new EventBus();
  </script>
</body>
```

### Api of the library

#### Register to an event
```js
  eventBus.on('my-event', function () {
    console.log('Inside `my-event`');
  });
```
With this code, each time `my-event` is emited this function will be executed.

#### Register only one time to an event
```js
  eventBus.once('my-event', function () {
    console.log('Inside `my-event`. It\'ll be executed only one time!');
  });
```
With this code, when `my-event` is emited this function will be executed. The next triggers of this event won't execute the callback because it is a one time event.

#### Register several time to an event
```js
  eventBus.exactly(3, 'my-event', function () {
    console.log('Inside `my-event`. It\'ll be executed only 3 times!');
  });
```
With this code, when `my-event` is emited this function will be executed with a maximum of triggers of 3.

#### Detach an event
```js
  var callbackForMyEvent = function () {
    console.log('Inside `my-event`.');
  };

  eventBus.on('my-event', callbackForMyEvent);

  eventBus.emit('my-event');

  eventBus.detach('my-event', callbackForMyEvent);
```
This code will emit the event `my-event` and then detach the given callback for this event. So it'll not be executed anymore.

#### Remove an event
```js
  eventBus.on('my-event', function () {
    console.log('Inside `my-event`.');
  });

  eventBus.emit('my-event');

  eventBus.die('my-event');
```
This code will emit the event `my-event` and then detach all the callbacks for this event. So any of them won't be executed anymore.

Note that `off` is an alias of `die`.

# License
MIT