var repository = require('./repository');
var requestService = require('./requestsService');

module.exports = {
    processMessage: function (message) {
        repository.save(message);
        requestService.process(message);
    }
};