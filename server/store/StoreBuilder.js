var Promise = require('promise');

var portFinder    = require('../ports/PortFinder')();
var outController = require('../routes/outController');
var Store         = require('./Store');

function constructor() {
    portFinder.search();

    return {
        build: build
    }
}

//TODO for each store create different logger.

function build(storeConfig) {
    return new Promise(function (resolve, reject) {
        var initStore        = outController.initStore(storeConfig.id);
        var modemPortPromise = portFinder.find(storeConfig.modem);

        Promise.all([initStore, modemPortPromise]).then(function (res) {
            storeConfig.providerInitCommand = res[0].provider.init_command;
            storeConfig.modemPort           = res[1];

            var store = new Node(storeConfig);
            resolve(store);
        }).catch(function (err) {
            console.error(err);
        })
    });
}

module.exports = constructor();