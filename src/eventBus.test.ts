import { test } from 'vitest';
import { EventBus } from '../src/eventBus'; // Replace with your actual path

test('should register an event and trigger it', () => {
    const eventBus = new EventBus();
    let flag = false;

    eventBus.on('myEvent', () => {
        flag = true;
    });

    eventBus.emit('myEvent', null);

    if (!flag) throw new Error('Event not triggered');
});

test('should trigger an event only once', () => {
    const eventBus = new EventBus();
    let counter = 0;

    eventBus.once('myEvent', () => {
        counter++;
    });

    eventBus.emit('myEvent', null);
    eventBus.emit('myEvent', null);

    if (counter !== 1) throw new Error('Event triggered more than once');
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
        N
    );

    for (let i = 0; i < N + 1; i++) {
        eventBus.emit('myEvent', null);
    }

    if (counter !== N) throw new Error(`Event should be triggered exactly ${N} times`);
});

test('should kill an event with all its callbacks', () => {
    const eventBus = new EventBus();
    let flag = false;

    eventBus.on('myEvent', () => {
        flag = true;
    });

    eventBus.off('myEvent');
    eventBus.emit('myEvent', null);

    if (flag) throw new Error('Event should not be triggered after off()');
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
    eventBus.emit('myEvent', null);

    if (counter1 !== 0 || counter2 !== 1) throw new Error('Callback not detached correctly');
});
