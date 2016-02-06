var io        = require('socket.io-client');
var serverUrl = require('../properties').serverUrl;

module.exports = function () {
    var socket = io.connect(serverUrl, {reconnect: true});

    return {
        connect: function (nodeInfo) {
            socket.on('connect', function () {
                socket.emit('node initialization', nodeInfo);
            });
        },
        update : function (number) {
            socket.emit('node number', number);
        }
    }
};