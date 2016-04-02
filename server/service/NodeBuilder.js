var Promise = require('promise');

var portFinder    = require('./PortFinder')();
var outController = require('../../routes/outController');

var Node = require('./Node');

function constructor() {
    portFinder.search();

    return {
        build: build
    }
}

function build(nodeConfig) {
    return new Promise(function (resolve, reject) {
        var provider  = outController.getProvider(nodeConfig.provider);
        var modemPort = portFinder.find(nodeConfig.modem);

        Promise.all([provider, modemPort]).then(function (res) {
            nodeConfig.providerInitCommand = res[0].init_command;
            nodeConfig.modemPort           = res[1];

            var node = new Node(nodeConfig);
            resolve(node);
        });
    });
}

module.exports = constructor;