var log     = require('winston');
var Promise = require('promise');

var props         = require('./properties');
var outController = require('./routes/outController');
var nodeBuilder   = require('./service/NodeBuilder')();

function start() {
    props.nodes.forEach(function (nodeConfig) {
        nodeBuilder.build(nodeConfig).then(function (node) {

            node.start();

            node.on('number:detected', function (config) {
                outController.initSim(config.name, config.simId);
            });

            node.on('message:received', function (config, message) {
                outController.pushMessage(config.name, message)
            });

            outController.initNode(config.name);
        });
    });
}

module.exports = start;