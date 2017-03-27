var kue = require('kue');
const EventEmitter = require('events');
var _events = {};
const ATTEMPTS = 10;
const DELAY = 20;

module.exports = function ({config, events, log, listening}) {
    var queue = kue.createQueue({
        prefix: config.prefix,
        redis: config.redis,
    });
    log = log || function() {};
    events = events || new EventEmitter();
    listening = (listening === undefined)?true:listening;

    var handleResponse = function(event, err){
        if(err)
            return log("Error occured", err, event);
        log("Created event", event);
    };

    function emit(event, data) {
        queue.create(event, data).priority('high').attempts(ATTEMPTS).backoff( {delay: DELAY*1000, type:'fixed'} ).save(handleResponse.bind({}, event));
    }

    function on(event, cb) {
        if (!listening)
            return;
        events.on(event, cb);
        if (_events[event])
            return;
        _events[event] = true;
        queue.process(event, function(job, done){
            log("Processing event", event);
            try {
                events.emit(event, job.data);
                done();
            } catch(err) {
                done(err);
            }
        });   
    }

    process.once( 'SIGINT', function ( sig ) {
        queue.shutdown( 5000, function(err) {
            log( 'Attempting graceful shut down: ', err||'' );
            process.exit( 0 );
        });
    });

    return {on, emit};

}
