var log            = require('winston');
var Modem          = require('../modem/Modem');
var messageService = require('./messageService');
var operator       = require('./operator');
var outController  = require('../outRoutes/outSocket');
var modemPort      = require('../properties').modemPort;

module.exports = function () {
    var number;
    var modem = new Modem(function (num) {

        number = num;
        outController.update(number);
        log.info('Initialized new SIM. Number:', num);
    }, function (msg) {

        messageService.processMessage(msg);
        console.log('Received new message.', JSON.stringify(msg));
    });

    modem(modemPort, operator.getOperator().initCommand);

    outController.connect({nodeId: 'Faith'});
};