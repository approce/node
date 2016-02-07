var log    = require('winston');
var socket = require('./socket');

function onRequest(callback) {
    socket.on('request', function (req) {
        log.info('New request received.', req);

        callback(req);
    });
}
function onCommand(callback) {
    socket.on('command', function (command) {
        log.info('Received command from server.', command);

        callback(command);
    });
}

module.exports = {
    onRequest: onRequest,
    onCommand: onCommand
};