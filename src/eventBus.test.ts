import { test } from 'vitest';
import assert from 'assert';
import { EventBus } from '../src/eventBus'; // Replace with your actual path

test('should register an event and trigger it', () => {
    const eventBus = new EventBus();
    let flag = false;

    eventBus.on('myEvent', () => {
        flag = true;
    });

    eventBus.emit('myEvent');

    if (!flag) {
        throw new Error('Event not triggered');
    }
});

test('should trigger an event only once', () => {
    const eventBus = new EventBus();
    let counter = 0;

    eventBus.once('myEvent', () => {
        counter++;
    });

    eventBus.emit('myEvent');
    eventBus.emit('myEvent');

    if (counter !== 1) {
        throw new Error('Event triggered more than once');
    }
});

test('should trigger an event exactly N times', () => {
    const eventBus = new EventBus();
    let counter = 0;
    const N = 3;

    eventBus.exactly(
        'myEvent',
        () => {
            counter++;
        },
        N,
    );

    for (let i = 0; i < N + 1; i++) {
        eventBus.emit('myEvent');
    }

    if (counter !== N) {
        throw new Error(`Event should be triggered exactly ${N} times`);
    }
});

test('should kill an event with all its callbacks', () => {
    const eventBus = new EventBus();
    let flag = false;

    eventBus.on('myEvent', () => {
        flag = true;
    });

    eventBus.off('myEvent');
    eventBus.emit('myEvent');

    if (flag) {
        throw new Error('Event should not be triggered after off()');
    }
});

test('should detach a specific callback for an event', () => {
    const eventBus = new EventBus();
    let counter1 = 0;
    let counter2 = 0;

    const callback1 = () => {
        counter1++;
    };
    const callback2 = () => {
        counter2++;
    };

    eventBus.on('myEvent', callback1);
    eventBus.on('myEvent', callback2);

    eventBus.detach('myEvent', callback1);
    eventBus.emit('myEvent');

    if (counter1 !== 0 || counter2 !== 1) {
        throw new Error('Callback not detached correctly');
    }
});

test('off', async () => {
    const eventBus = new EventBus();
    let triggered = false;
    eventBus.on('my-event', () => {
        triggered = true;
    });
    eventBus.off('my-event');
    eventBus.emit('my-event');
    assert(triggered === false);
});

test('detach', async () => {
    const eventBus = new EventBus();
    let triggered = 0;
    const callback = () => {
        triggered++;
    };
    eventBus.on('my-event', callback);
    eventBus.emit('my-event');
    eventBus.detach('my-event', callback);
    eventBus.emit('my-event');
    assert(triggered === 1);
});

test('once', async () => {
    const eventBus = new EventBus();
    let triggered = 0;
    eventBus.once('my-event', () => {
        triggered++;
    });
    eventBus.emit('my-event');
    eventBus.emit('my-event');
    assert(triggered === 1);
});

test('exactly', async () => {
    const eventBus = new EventBus();
    let triggered = 0;
    eventBus.exactly(
        'my-event',
        () => {
            triggered++;
        },
        3,
    );
    eventBus.emit('my-event');
    eventBus.emit('my-event');
    eventBus.emit('my-event');
    eventBus.emit('my-event');
    assert(triggered === 3);
});

test('greedy wildcard emit', async () => {
    const eventBus = new EventBus();
    let triggered = 0;
    eventBus.on('my-event.a', () => {
        triggered++;
    });
    eventBus.emit('my-event.**');
    eventBus.emit('my-event.a.name.b');
    eventBus.emit('my-event.name.b');
    assert(triggered === 1);
});

test('nested wildcard and emit', async () => {
    const eventBus = new EventBus();
    let triggered = 0;
    eventBus.on('my-event.a.name', () => {
        triggered++;
    });
    eventBus.emit('my-event.*.name');
    eventBus.emit('my-event.a.name.b');
    eventBus.emit('my-event.name.b');
    assert(triggered === 1);
});

test('nested wildcard multi and emit', async () => {
    const eventBus = new EventBus();
    let triggered = 0;
    eventBus.on('my-event.a.name-hello', () => {
        triggered++;
    });
    eventBus.emit('my-event.*.**');
    eventBus.emit('my-event.a.name.b');
    eventBus.emit('my-event.name.b');
    assert(triggered === 1);
});

test('nested wildcard and emit double wild', async () => {
    const eventBus = new EventBus();
    let triggered = 0;
    eventBus.on('my-event.x.name.b', () => {
        triggered++;
    });
    eventBus.emit('my-event.x*name.**');
    eventBus.emit('my-event.x.name.b');
    eventBus.emit('my-event.x.other-name.b');
    assert(triggered === 2);
});

test('nested wildcard and emit with "on"', async () => {
    const eventBus = new EventBus();
    let triggered = 0;
    eventBus.on('my-event.x.**', () => {
        triggered++;
    });
    eventBus.emit('my-event.x.name');
    eventBus.emit('my-event.x.name.b');
    eventBus.emit('my-event.name.b');
    assert(triggered === 2);
});

test('nested wildcard and emit with "on" multi card', async () => {
    const eventBus = new EventBus();
    let triggered = 0;
    eventBus.on('my-event.y*b', () => {
        triggered++;
    });
    eventBus.emit('my-event.y');
    eventBus.emit('my-event.yz');
    eventBus.emit('my-event.y.z');
    eventBus.emit('my-event.y.name');
    eventBus.emit('my-event.y.name.b'); // this should be the match
    eventBus.emit('my-event.y.other-name.c');
    assert(triggered === 1);
});

test('passing data', async () => {
    const eventBus = new EventBus();
    let content = null;
    eventBus.on('my-event', (data) => {
        content = data;
    });
    eventBus.emit('my-event', 'hello', 'world');
    assert.equal(content, 'hello');
});
test('passing data multi args', async () => {
    const eventBus = new EventBus();
    let content = null;
    eventBus.on('my-event', (data, other) => {
        content = other;
    });
    eventBus.emit('my-event', 'hello', 'world', 'other');
    assert.equal(content, 'world');
});

test('passing data object', async () => {
    const eventBus = new EventBus();
    let content = null;
    eventBus.on('my-event', (data) => {
        content = data;
    });
    eventBus.emit('my-event', { key: 'value' });
    assert.deepEqual(content, { key: 'value' });
});
