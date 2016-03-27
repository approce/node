var log           = require('winston');
var Modem         = require('../server/modem/Modem');
var outController = require('../routes/outController');
var inController  = require('../routes/inController');
var nodeId        = require('../properties').nodeId;
var modemFinder   = require('../server/service/ModemFinder');
var props         = require('../properties');

function start() {
    props.nodes.forEach(function (node) {
        modemFinder.find(node.modem, function (port) {
            var start2 = new Modem(port);
            start2.start();
            start2.on('c number detected', function () {
                console.log(arguments);
            });
            start2.on('c sms received', function () {
                console.log(arguments);
            })
        })
    });
}

module.exports = start;

//
//var number;
//Modem.setNumberListener(function (num) {
//    number = num;
//    outController.update(number);
//    log.info('Initialized new SIM. Number:', num);
//});
//
////modem.start();
//
//inController.onCommand(function (command) {
//    if (command == "change sim") {
//        log.info('Restarting modem.');
//        Modem.restart();
//    }
//});
//
//outController.connect({nodeId: nodeId});