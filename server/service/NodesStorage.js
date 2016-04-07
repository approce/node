var EventEmitter = require('events').EventEmitter;
var logger       = require('winston');

function constructor() {
    logger.log('debug', 'Nodes storage instantiated');

    var storage = new EventEmitter(),
        nodes   = {};

    storage.get = get;
    storage.on('nodes:add', addNode);

    function get() {
        return nodes;
    }

    function addNode(node) {
        nodes[node.id] = node;
        logger.log('debug', 'Node id:%s added to storage.', node.config.id);
    }

    return storage;
}

module.exports = constructor();