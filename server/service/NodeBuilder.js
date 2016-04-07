var Promise = require('promise');

var portFinder    = require('./PortFinder')();
var outController = require('../routes/outController');

var Node = require('./Node');

function constructor() {
    portFinder.search();

    return {
        build: build
    }
}

function build(nodeConfig) {
    return new Promise(function (resolve, reject) {
        var initNode         = outController.initNode(nodeConfig.id);
        var modemPortPromise = portFinder.find(nodeConfig.modem);

        Promise.all([initNode, modemPortPromise]).then(function (res) {
            nodeConfig.providerInitCommand = res[0].provider.init_command;
            nodeConfig.modemPort           = res[1];

            var node = new Node(nodeConfig);
            resolve(node);
        }).catch(function (err) {
            console.error(err);
        })
    });
}

module.exports = constructor();