var log      = require('winston');
var Promise  = require('promise');
var schedule = require('node-schedule');

var props        = require('./properties');
var storeBuilder = require('./store/StoreBuilder');
var socket       = require('./routes/outSocket')();

function start() {
    props.nodes.forEach(function (storeConfig) {
        var configPromise = socket.getStoreConfig(storeConfig.id);

        storeBuilder.build(configPromise, storeConfig).then(function (store) {
            store.start();

            socket.storeInit(store.id);

            store.on('number:detected', function (config) {
                socket.simInit(config.id, config.simId);
            });

            store.on('message:received', function (config, message) {
                socket.pushMessage(config.id, message);
            });
        });
    });
}

module.exports = start;