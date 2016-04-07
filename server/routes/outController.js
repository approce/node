var log       = require('winston');
var request   = require('request-promise');
var serverUrl = require('../properties').serverUrl;


module.exports = {
    initNode   : function initNode(nodeName) {
        return post('nodes/' + nodeName + '/');
    },
    initSim    : function initSim(nodeName, simId) {
        return post('nodes/' + nodeName + '/sim/' + simId);
    },
    pushMessage: function pushMessage(nodeName, message) {
        return post('nodes/' + nodeName + '/messages', message);
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