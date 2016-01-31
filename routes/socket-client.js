var io = require('socket.io-client');

var socket = io.connect('http://198.211.120.110:3001/');

socket.on('message', function (msg) {
    console.log(msg);
    console.log('connect');
});