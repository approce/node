var log       = require('winston');
var request   = require('request-promise');
var serverUrl = require('../properties').serverUrl;

function connect(nodeInfo) {
}

function update(number) {
}

function pushMessage(nodeId, message) {
    return post('nodes/' + nodeId + '/messages', message);
}

function getProvider(providerId) {
    return get('providers/' + providerId);
}

function initSim(nodeId, providerId, simId) {
    return post('nodes/' + nodeId + '/sim/' + providerId + '/' + simId);
}

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

module.exports = {
    connect    : connect,
    update     : update,
    pushMessage: pushMessage,
    getProvider: getProvider,
    initSim    : initSim
};