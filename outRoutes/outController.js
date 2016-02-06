var log       = require('winston');
var request   = require('request');
var serverUrl = require('../config.json').serverUrl;

//TODO should be removed
module.exports = {

    pushMessage: function (message) {
        var options = {
            url : serverUrl + '/messages',
            json: message
        };

        request.post(options, this.error);
    },

    error: function (er, resp, body) {
        if (er) {
            log.error("Error on execurijg request to remote server.", er, resp);
        }
    }
};