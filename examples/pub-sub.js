const events = require('../')({
    config: require('./config'),
    log: console.log
});

events.on("email", data => {
    console.log("Data is", data);
});

events.on("email", data => {
    console.log("2) Data is", data);
});

setInterval(() => {
    events.emit("email", {
        name: 'wasap',
    });
}, 2000);
