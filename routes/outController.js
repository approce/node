var log    = require('winston');
var socket = require('./socket');

function connect(nodeInfo) {
    socket.on('connect', function () {
        socket.emit('node initialization', nodeInfo);
        log.debug('Socket connection established.');
    });
}

function update(number) {
    socket.emit('node number', number);
    log.debug('Send new node sim number to server.')
}

function send(request) {
    log.debug('Send request with message to server.');
    socket.emit('request', request);
}

module.exports = {
    connect: connect,
    update : update,
    send   : send
};
