var fs = require('fs');

module.exports = {
    save: function (data) {
        fs.appendFile('../messages.log', JSON.stringify(data) + '\n', function (err) {
            if (err) {
                console.log("Error while saving message to file. Message: " + data + "\n Error: \n" + err);
            }
        });
    }
};