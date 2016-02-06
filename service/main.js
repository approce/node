var log            = require('winston');
var modem          = require('../modem/Modem');
var operator       = require('./operator');
var outController  = require('../routes/outSocket');
var messageService = require('./messageService');

module.exports = function () {
    var number;
    modem.setNumberListener(function (num) {
        number = num;
        outController.update(number);
        log.info('Initialized new SIM. Number:', num);
    });

    modem.start(operator.getOperator().initCommand);

    outController.connect({nodeId: 'Faith'});
};