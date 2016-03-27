var log       = require('winston');
var request   = require('request-promise');
var serverUrl = require('../properties').serverUrl;

function connect(nodeInfo) {
}

function update(number) {
}

function send(request) {
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

function post(uri) {
    return request.post({
        uri : serverUrl + '/' + uri,
        json: true
    });
}

module.exports = {
    connect    : connect,
    update     : update,
    send       : send,
    getProvider: getProvider,
    initSim    : initSim
};