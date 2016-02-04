var repository = require('./repository');
var controller = require('../outRoutes/outController');

module.exports = {
    processMessage: function (message) {
        repository.save(message);
        controller.pushMessage(message);
    }
};