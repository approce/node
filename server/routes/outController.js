var log       = require('winston');
var request   = require('request-promise');
var serverUrl = require('../properties').serverUrl;


module.exports = {
    initNode: function initNode(nodeId) {
        return post('nodes/' + nodeId + '/');
    },
    initSim : function initSim(nodeId, simId) {
        return post('nodes/' + nodeId + '/sim/' + simId);
    },

    pushMessage: function pushMessage(nodeId, message) {
        return post('nodes/' + nodeId + '/messages', message);
    },

    getCommands: function (nodes) {
        return post('/nodes/commands', nodes);
    }
};

function get(uri) {
    return request.get({
        uri : serverUrl + '/' + uri,
        json: true
    });
}

function post(uri, body) {
    return request.post({
        uri : serverUrl + '/' + uri,
        json: true,
        body: body
    });
}