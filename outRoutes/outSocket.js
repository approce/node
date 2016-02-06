var log       = require('winston');
var io        = require('socket.io-client');
var serverUrl = require('../properties').serverUrl;
var socket    = io.connect(serverUrl, {reconnect: true});

module.exports = {
    onNewRequest: function (callback) {
        log.silly('Setting new listener for received requests.');

        socket.on('request', function (req) {
            callback(req);
            log.debug('New request received.', req);
        });
    },

    connect: function (nodeInfo) {
        socket.on('connect', function () {
            socket.emit('node initialization', nodeInfo);
            log.debug('Socket connection established.');
        });
    },
    update : function (number) {
        socket.emit('node number', number);
        log.debug('Send new node sim number to server.')
    },
    send   : function (request) {
        log.debug('Send request with message to server.');
        socket.emit('request', request);
    }
};
