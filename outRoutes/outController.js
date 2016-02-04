var request = require('request');

module.exports = {
    pushMessage: function (message) {
        var options = {
            url : 'http://localhost:3001/messages',
            json: message
        };

        request.post(options, function (error, response, body) {
            if (error) {
                console.log("Error on pushing message to server. Message: " + message);
            }
        });
    }
};