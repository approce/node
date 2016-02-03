var io     = require('socket.io-client');
var socket = io.connect('http://localhost:3001/');

socket.on('message', function (msg) {
    console.log(msg);
    console.log('connect');
});

module.exports = {
    sendMessage: function (data) {
        socket.emit('new message', data);
    }
};