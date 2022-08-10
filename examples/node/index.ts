import EventBus from '../../src/index';

const bus = new EventBus();

function ctx() {}

function toto() {
  console.log('INSIDE toto', this);
}

function tata() {
  console.log('INSIDE tata', this);
}

bus.on('toto', toto);
bus.once('tata', tata);

bus.emit('toto', ctx);
bus.emit('toto', ctx);
bus.emit('toto', ctx);
bus.detach('toto', toto);
bus.emit('toto', ctx); // no triggered
bus.emit('toto', ctx); // no triggered

bus.emit('tata', ctx);
bus.emit('tata', ctx); // no triggered
