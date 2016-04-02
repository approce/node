var log     = require('winston');
var Promise = require('promise');

var props         = require('./properties');
var outController = require('../routes/outController');
var nodeBuilder   = require('./service/NodeBuilder')();

function start() {
    props.nodes.forEach(function (nodeConfig) {
        nodeBuilder.build(nodeConfig).then(function (node) {

            console.log('initialized!');
            node.start();

            node.on('number:detected', function (config) {
                outController.initSim(config.id, config.provider, config.simId);
            });

            node.on('message:received', function (config, message) {
                outController.pushMessage(config.id, message)
            })
        });
    });
}

module.exports = start;