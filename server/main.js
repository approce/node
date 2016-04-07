var log      = require('winston');
var Promise  = require('promise');
var schedule = require('node-schedule');

var props            = require('./properties');
var outController    = require('./routes/outController');
var nodeBuilder      = require('./service/NodeBuilder')();
var nodesStorage     = require('./service/NodesStorage');
var commandsExecutor = require('./service/CommandsExecutor')();

function start() {
    props.nodes.forEach(function (nodeConfig) {
        nodeBuilder.build(nodeConfig).then(function (node) {

            node.start();

            //TODO:building/configuring nodes & setting listeners -isn't that the same thing?
            node.on('number:detected', function (config) {
                outController.initSim(config.id, config.simId);
            });

            node.on('message:received', function (config, message) {
                outController.pushMessage(config.name, message)
            });

            nodesStorage.emit('nodes:add', node);
            outController.initNode(config.name);
        });
    });
    commandsExecutor.schedule();
}

module.exports = start;