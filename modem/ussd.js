var session = require('modem').Ussd_Session();

module.exports = {
    process: function (modem, ussdCommand, callback) {
        session.modem = modem;

        session.execute = function () {
            session.query(ussdCommand, function (code, msg) {
                var number = parseNumber(msg);
                callback(number);
            });
        };

        session.start();

        var parseNumber = function (msg) {
            return Math.max.apply(null, msg.match(/\d+/g));
        }
    }
};