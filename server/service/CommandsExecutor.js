var logger   = require('winston');
var schedule = require('node-schedule');

var nodesStorage   = require('./NodesStorage');
var outCojntroller = require('../routes/outController');

var repeatSchedule = 5; //min

function constructor() {
    logger.log('debug', 'Commands executor instantiated');

    var scheduled = false;

    //TODO do not listen to add event. Listen to a kind of 'number inited'
    //nodesStorage.on('nodes:add', fetchCommand);

    function scheduleFetches() {
        if (!scheduled) {
            createScheduler();
            scheduled = true;
        } else {
            logger.log('error', 'Scheduler for nodes commands already started');
        }
    }

    return {
        schedule: scheduleFetches
    };
}

function createScheduler() {
    //TODO test:
    var nodes = nodesStorage.get();
    processCommands(nodes);

    schedule.scheduleJob('*/' + repeatSchedule + ' * * * *', function () {
        logger.log('debug', 'Scheduled querying for commands');

        var nodes = nodesStorage.get();
        processCommands(nodes);
    });
}

function processCommands(nodes) {
    var nodesIds = Object.keys(nodes);

    fetchCommands(nodesIds).then(executeCommands.bind(null, nodes));
}

function fetchCommands(nodeIds) {
    logger.log('debug', 'Querying to server to get commands for nodes: %s', nodeIds);

    return outCojntroller.getCommands(nodeIds);
}

function executeCommands(nodes, commands) {
    logger.log('debug', 'Executing  commands: ', commands);

    Object.keys(commands).forEach(function (nodeId) {
        executeCommand(nodes[nodeId], commands[nodeId]);
    });
}

function executeCommand(node, command) {
    console.log('HERE', node.id, command);
}

module.exports = constructor();