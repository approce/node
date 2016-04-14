var Promise = require('promise');

var portFinder = require('../ports/PortFinder')();
var Store      = require('./Store');

function constructor() {
    portFinder.search();

    return {
        build: build
    }
}

//TODO for each store create different logger.

function build(configPromise, storeConfig) {
    return new Promise(function (resolve, reject) {
        var modemPortPromise = portFinder.find(storeConfig.modem);

        Promise.all([configPromise, modemPortPromise]).then(function (res) {
            storeConfig.providerInitCommand = res[0].provider.init_command;
            storeConfig.modemPort           = res[1];

            var store = new Store(storeConfig);
            resolve(store);
        }).catch(function (err) {
            console.error(err);
        })
    });
}

module.exports = constructor();