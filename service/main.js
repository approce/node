var modem          = require('../modem/Modem');
var messageService = require('./messageService');
var operator       = require('./operator');

module.exports = function (modemPort) {
    var number;
    modem.start(modemPort, operator.getOperator().initCommand, function (num) {
        console.log('Initialized new SIM number: ' + num);

        number = num;
    }, function (msg) {
        console.log('Received new message: ' + JSON.stringify(msg));

        messageService.processMessage(msg);
    });
};


/*
 {
 sim_id    : 992255439,
 originator: 'Romko',
 text      : 'I"m glad to see you!'
 }
 */