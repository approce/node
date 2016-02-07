var log            = require('winston');
var modem          = require('../modem/Modem');
var outController  = require('../routes/outController');
var inController   = require('../routes/inController');
var nodeId         = require('../properties').nodeId;
var messageService = require('./messageService');

module.exports = function () {
    var number;
    modem.setNumberListener(function (num) {
        number = num;
        outController.update(number);
        log.info('Initialized new SIM. Number:', num);
    });

    modem.start();

    inController.onCommand(function (command) {
        if (command == "change sim") {
            log.info('Restarting modem.');
            modem.restart();
        }
    });

    outController.connect({nodeId: nodeId});
};