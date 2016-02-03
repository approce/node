var repository = require('./repository');
var controller = require('../routes/controller');

module.exports = {
    processMessage: function (message) {
        repository.save(message);
        controller.sendMessage(message);
    }
};