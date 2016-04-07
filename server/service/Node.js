var EventEmitter = require('events').EventEmitter;

var Modem = require('../modem/Modem');

function constructor(config) {
    var node  = new EventEmitter(),
        modem = Modem(config.modemPort, config.providerInitCommand);

    node.id     = config.id;
    node.config = config;
    node.start  = modem.start;

    modem.on('c number detected', function (simId) {
        node.config.simId = simId;
        node.emit('number:detected', node.config);
    });

    modem.on('c sms received', function (message) {
        node.emit('message:received', node.config, message);
    });

    return node;
}

module.exports = constructor;