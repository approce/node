var log           = require('winston');
var inController  = require('../routes/inController');
var outController = require('../routes/outController');

var requests = [];

function evaluateMessage(req, msg) {
    return req.service == msg.service;
}

function processMessage(msg) {
    var processed = false;
    requests.forEach(function (entry, i) {
        if (evaluateMessage(entry, msg)) {
            log.info('Request successfully processed.', entry, msg);
            outController.send({
                requestId: entry.id,
                message  : msg
            });
            processed = true;
            requests.splice(i, 1);
        }
    });
    if (!processed) {
        log.warn('Message (id:%s) matched to service was not matched to any request', msg.id);
    }
}
var requestService = {

    add: function (req) {
        requests.push(req);
    },

    process: processMessage
};

inController.onRequest(requestService.add);

module.exports = requestService;