var Modem          = require('../modem/Modem');
var messageService = require('./messageService');
var operator       = require('./operator');

module.exports = function (modemPort) {
    var number;
    var modem = new Modem(function (num) {

        number = num;
        console.log('Initialized new SIM number: ' + num);
    }, function (msg) {

        messageService.processMessage(msg);
        console.log('Received new message: ' + JSON.stringify(msg));
    });

    modem(modemPort, operator.getOperator().initCommand);
};