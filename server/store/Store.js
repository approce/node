var EventEmitter = require('events').EventEmitter;

var Modem = require('./modem/Modem');

function constructor(config) {
    var store  = new EventEmitter(),
        modem = Modem(config.modemPort, config.providerInitCommand);

    store.id     = config.id;
    store.config = config;//needed?
    store.start  = modem.start;

    modem.on('c number detected', function (simId) {
        store.config.simId = simId;
        store.emit('number:detected', store.config);
    });

    modem.on('c sms received', function (message) {
        store.emit('message:received', store.config, message);
    });

    store.on('sim:next', simNext);

    return store;
}

function simNext() {
    //TODO start 28BYJ movement
    console.log('executing command sim:next');
}

module.exports = constructor;