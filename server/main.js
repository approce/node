var log           = require('winston');
var Modem         = require('./modem/Modem');
var outController = require('../routes/outController');
var portFinder    = require('./service/PortFinder')();
var props         = require('./properties');
var Promise       = require('promise');

function start() {
    portFinder.search();
    portFinder.find(36262309).then(function (port) {
        console.log('horray', port);
    });
    portFinder.find(32781500).then(function (port) {
        console.log('horray', port);
    });
    portFinder.find(1231235).then(function (port) {
    }).catch(function () {
        console.log('so sad!');
    });
    return;

    props.nodes.forEach(function (node) {
        var providerPromise  = outController.getProvider(node.provider);
        var modemPortPromise = portFinder.find(node.modem);

        Promise.all([providerPromise, modemPortPromise]).then(startNode.bind(null, node));
    });
}

function startNode(node, res) {
    var provider = res[0],
        port     = res[1],
        modem    = new Modem(port, provider.init_command);

    modem.start();

    modem.on('c number detected', function (simId) {
        //initializing node sim on server:
        outController.initSim(node.id, provider.id, simId).then(function () {
            console.log('Node new sim have been successfully initialized on server');
        });
    });

    modem.on('c sms received', function (message) {
        outController.pushMessage(node.id, message)
    })
}

module.exports = start;