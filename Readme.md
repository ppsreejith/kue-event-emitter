# Kue-event-emitter

An EventEmitter interface over [Kue](https://github.com/Automattic/kue).

The tests and usage documentation assumes a locally running Redis server at port 5000.

### Installation
```
npm install kue-event-emitter --save
```

### Usage
```js
var config = require('./config');
var EventEmitter = require('../index.js')({
    config, 
    log: console.log, 
    listening: true
});

EventEmitter.on("event-data", function(payload) {
    console.log("Received payload", payload);
})
EventEmitter.emit("event-data", {name: "some data"});
```

### Updates
Currently in beta stage. More reliable than the Rabbot version. Will update with more features soon.