var log      = require('winston');
var Promise  = require('promise');
var schedule = require('node-schedule');

var props            = require('./properties');
var outController    = require('./routes/outController');
var nodeBuilder      = require('./service/NodeBuilder');
var nodesStorage     = require('./service/NodesStorage');
var commandsExecutor = require('./service/CommandsExecutor');

function start() {
    props.nodes.forEach(function (nodeConfig) {
        nodeBuilder.build(nodeConfig).then(function (node) {
            node.start();

            node.on('number:detected', function (config) {
                outController.initSim(config.id, config.simId).then(function () {
                    commandsExecutor.processCommand(node);
                });
            });

            node.on('message:received', function (config, message) {
                outController.pushMessage(config.name, message)
            });

            nodesStorage.emit('nodes:add', node);
        });
    });
    commandsExecutor.schedule();
}

module.exports = start;