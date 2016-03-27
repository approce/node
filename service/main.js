var log           = require('winston');
var Modem         = require('../server/modem/Modem');
var outController = require('../routes/outController');
var inController  = require('../routes/inController');
var nodeId        = require('../properties').nodeId;
var modemFinder   = require('../server/service/ModemFinder');
var props         = require('../properties');
var when          = require('when');
var Promise       = require('promise');

function start() {
    props.nodes.forEach(function (node) {
        var providerPromise  = outController.getProvider(node.provider);
        var modemPortPromise = modemFinder.find(node.modem);

        Promise.all([providerPromise, modemPortPromise]).then(startModem);
    });
}

function startModem(res) {
    var provider = res[0],
        port     = res[1],
        modem    = new Modem(port, provider.init_command);

    modem.start();

    modem.on('c number detected', function () {
        console.log(arguments);
    });
    modem.on('c sms received', function () {
        console.log(arguments);
    })
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