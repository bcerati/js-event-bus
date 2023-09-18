# js-event-bus

### Simple Event Bus library built for any JavaScript application.

(this is an updated fork of [js-event-bus](https://github.com/bcerati/js-event-bus/tree/main) by [bcerati])
**Refactoring and Updates:**

-   Remove some unnecessary redundant method to make it SOLID
-   Remove different file language versions to unify the conde into one and ease maintenance
-   Fixed and made the code JsDocs and Ts compliant
-   Fixed minor code issues
-   Added correct distribution files to modules and browser
-   Added Vitest unit test (passed)
-   Added terser, webpack (for browser window export) and ts (for module export)
-   Removed examples folder, the examples are now in the JsDocs comments for Docs creation
-   Bump the version to Major since there was a lot of refactoring and changes in the Class API

## Installation

### Using npm

```
npm i @knighttower/js-event-bus
```

### Using yarn

```
yarn add @knighttower/js-event-bus
```

## Usage

This library was built so you can use it in any JS application like Node.js apps, browser apps etc. The API is always the same.

### Importing in Node.js application

If you want to use it in your Node.js apps you can import the library like this:

```js
import EventBus from '@knighttower/js-event-bus';
```

### Importing in browser application

If you want to use it in your Browser apps you can import the library like this:

```html
<body>
    <div>Put your content here</div>

    <script src=" https://cdn.jsdelivr.net/npm/@knighttower/js-event-bus@latest/dist/browser/eventBus.min.js "></script>
    <script>
        const eventBus = new EventBus();
    </script>
</body>
```

### Api of the library

#### Register to an event

```js
eventBus.on('my-event', function() {
    console.log('Inside `my-event`');
});
```

With this code, each time `my-event` is emitted this function will be executed.

#### Register only one time to an event

```js
eventBus.once('my-event', function() {
    console.log("Inside `my-event`. It'll be executed only one time!");
});
```

With this code, when `my-event` is emitted this function will be executed. The next triggers of this event won't execute the callback because it is a one time event.

#### Register several time to an event

```js
eventBus.exactly(3, 'my-event', function() {
    console.log("Inside `my-event`. It'll be executed only 3 times!");
});
```

With this code, when `my-event` is emitted this function will be executed with a maximum of triggers of 3.

#### Register using wildcards

You can use wildcards to register listeners using a specific pattern.

```js
eventBus.on('my-event.*', function() {
    console.log('Inside `my-event.*`');
});
```

The callback will be executed with the events like `my-event.x`.

-   `my-event.x` **will** trigger the callback ;
-   `my-event.y` **will** trigger the callback ;
-   `my-event` **will not** trigger the callback ;
-   `my-event.x.y` **will not** trigger the callback ;

You can also use multiple wildcards to register listeners using a specific pattern.

```js
eventBus.on('my-event.*.name.**', function() {
    console.log('my-event.*.name.**`');
});
```

The callback will be executed with the events like `my-event.a.name.b.c`.

-   `my-event.a.name.b.c` **will** trigger the callback ;
-   `my-event.a.name.b` **will** trigger the callback ;
-   `my-event.name.b` **will not** trigger the callback ;

#### Emit an event

You can emit an event by calling the `emit` function. The arguments are the following:

-   the name of the event ;
-   the context with which it will be fired ;
-   ... all the arguments.

Here are some examples:

```js
eventBus.emit('my-event');
eventBus.emit('my-event', null, 'a', 'b'); // your callback sould be function (a, b) { ... }
eventBus.emit('my-event', new SomeObject(), 'a', 'b'); // your callback sould be function (a, b) { ... } and `this` will be set to the context of `SomeObject`
```

#### Detach an event

```js
var callbackForMyEvent = function() {
    console.log('Inside `my-event`.');
};

eventBus.on('my-event', callbackForMyEvent);

eventBus.emit('my-event');

eventBus.detach('my-event', callbackForMyEvent);
```

This code will emit the event `my-event` and then detach the given callback for this event. So it'll not be executed anymore.

#### Detach an event for all the callbacks that have been set before

```js
eventBus.detach('my-event');
```

This code will remove the event `my-event` from the event bus.

#### Remove an event

```js
eventBus.on('my-event', function() {
    console.log('Inside `my-event`.');
});

eventBus.emit('my-event');

eventBus.off('my-event');
```

This code will emit the event `my-event` and then detach all the callbacks for this event. So any of them won't be executed anymore.

# License

MIT
