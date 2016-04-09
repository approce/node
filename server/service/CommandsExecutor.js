var logger   = require('winston');
var schedule = require('node-schedule');

var nodesStorage  = require('./NodesStorage');
var outController = require('../routes/outController');

var repeatSchedule = 5; //min

function constructor() {
    logger.log('debug', 'Commands executor instantiated');

    var scheduled = false;

    function scheduleFetches() {
        if (!scheduled) {
            createScheduler();
            scheduled = true;
        } else {
            logger.log('error', 'Scheduler for nodes commands already started');
        }
    }

    return {
        processCommand: processCommandForSingleNode,
        schedule      : scheduleFetches
    };
}

function createScheduler() {
    schedule.scheduleJob('*/' + repeatSchedule + ' * * * *', function () {
        var nodes = nodesStorage.get();

        logger.log('debug', 'Scheduled querying to server to get commands for nodes: %s', Object.keys(nodes));

        processCommands(nodes);
    });
}

function processCommandForSingleNode(node) {
    logger.log('debug', 'Query to get command for new node id: %s', node.id);

    var nodes      = {};
    nodes[node.id] = node;
    processCommands(nodes);
}

function processCommands(nodes) {
    var nodesIds = Object.keys(nodes);

    outController.getCommands(nodesIds).then(executeCommands.bind(null, nodes));
}

function executeCommands(nodes, commands) {
    logger.log('debug', 'Executing  commands: ', commands);

    Object.keys(commands).forEach(function (nodeId) {
        executeCommand(nodes[nodeId], commands[nodeId]);
    });
}

function executeCommand(node, command) {
    //todo replace to case:
    if (command === 'sim:next') {
        node.emit('sim:next');
    }
}

module.exports = constructor();