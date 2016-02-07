var io        = require('socket.io-client');
var serverUrl = require('../properties').serverUrl;

module.exports = io.connect(serverUrl, {reconnect: true});
