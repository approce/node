var Promise   = require('promise');
var io        = require('socket.io-client');
var logger    = require('winston');
var serverUrl = require('../properties').serverUrl;

function constructor() {
    logger.log('debug', 'Socket controller initialized');

    var socket = io.connect(serverUrl, {reconnect: true});

    socket.on('connection', function () {
        logger.log('debug', 'Socket connection established successfully')
    });

    return {
        //out controllers:
        getStoreConfig: function (storeId) {
            return new Promise(function (res, rej) {
                socket.emit('store:config', storeId);
                socket.on('store:config', res);
            })
        },

        //in controllers:
        storeInit  : function (storeId) {
            socket.emit('store:init', storeId);
        },
        simInit    : function (id, simId) {
            socket.emit('sim:init', id, simId);
        },
        pushMessage: function (storeId, message) {
            socket.emit('message:new', storeId, message);
        }
    }
}

module.exports = constructor;