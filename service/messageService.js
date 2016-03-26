var log            = require('winston');
var repository     = require('./repository');
var requestService = require('./requestsService');
var modem          = require('../server/modem/Modem');

function detectMessageService(msg) {
    //TODO mockup.
    var service = 'vk';
    log.info('Message (id:%s) have been matched to (%s) service', msg.id, service)
    return service;
}

function messageProcessing(msg) {
    log.info('Received new msg.', JSON.stringify(msg));

    msg.service = detectMessageService(msg);
    repository.save(msg);
    if (msg.service) {
        requestService.process(msg);
    } else {
        log.info('Message (id:%s) have been not matched to any service.', msg.id);
    }
}

modem.setMessageListener(messageProcessing);

module.exports = {
    processMessage: messageProcessing
};