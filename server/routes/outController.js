var log       = require('winston');
var request   = require('request-promise');
var serverUrl = require('../properties').serverUrl;

function pushMessage(nodeName, message) {
    return post('nodes/' + nodeName + '/messages', message);
}

function getProvider(providerId) {
    return get('providers/' + providerId);
}

function initNode(nodeName) {
    return post('nodes/' + nodeName + '/');
}

function initSim(nodeName, simId) {
    return post('nodes/' + nodeName + '/sim/' + simId);
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
    pushMessage: pushMessage,
    getProvider: getProvider,
    initNode   : initNode,
    initSim    : initSim
};