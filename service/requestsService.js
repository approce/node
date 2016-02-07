var log        = require('winston');
var controller = require('../routes/outSocket');
var outSocket  = require('../routes/outSocket');

var requests = [];

function evaluateMessage(req, msg) {
    return req.service == msg.service;
}

function processMessage(msg) {
    var processed = false;
    requests.forEach(function (entry, i) {
        if (evaluateMessage(entry, msg)) {
            log.info('Request successfully processed.', entry, msg);
            controller.send({
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

outSocket.onNewRequest(requestService.add);

module.exports = requestService;