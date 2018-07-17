# event-bus-js
Simple Event Bus library built for any JavaScript application.

## Installation

### Using npm
```
npm i event-bus-js --save
```

### Using yarn
```
yarn add event-bus-js
```

## Usage
This library was built so you can use it in any JS application like Node.js apps, browser apps etc. The API is always the same.

### Importing in Node.js application
If you want to use it in your Node.js apps you can import the library like this:

```js
const eventBus = require('event-bus-js')();
```

### Importing in browser application
If you want to use it in your Browser apps you can import the library like this:

```html
<body>

  <div>Put your content here</div>

  <script src="/lib/event-bus-js/lib/event-bus-js.min.js"></script>
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
This feature is not yet implemented.

#License
MIT