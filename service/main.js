var log            = require('winston');
var Modem          = require('../modem/Modem');
var messageService = require('./messageService');
var operator       = require('./operator');
var socket         = require('../outRoutes/outSocket')();

module.exports = function (modemPort) {
    var number;
    var modem = new Modem(function (num) {

        number = num;
        socket.update(number);
        log.info('Initialized new SIM. Number:', num);
    }, function (msg) {

        messageService.processMessage(msg);
        console.log('Received new message.', JSON.stringify(msg));
    });

    modem(modemPort, operator.getOperator().initCommand);

    socket.connect({nodeId: 'Faith'});
};