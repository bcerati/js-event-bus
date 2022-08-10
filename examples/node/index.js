"use strict";
exports.__esModule = true;
var index_1 = require("../../src/index");
var bus = new index_1["default"]();
function ctx() { }
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
