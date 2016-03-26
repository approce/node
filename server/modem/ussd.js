var log     = require('winston');
var session = require('modem').Ussd_Session();

var response_timeout = 10000;

function parseNumber(msg) {
    return Math.max.apply(null, msg.match(/\d+/g));
}

function process(modem, command, callback) {
    session.modem = modem;
    var number;

    session.execute = function () {
        session.query(command, function (code, response) {
            number = parseNumber(response);
            callback(number);
        });
    };

    session.setTimeout(response_timeout);
    session.on('timeout', function () {
        if (!number) {
            log.warn('Timeout on USSD query session.');
            log.warn('Start new USSD query session.');
            process(modem, command, callback);
        }
    });

    session.start();
}

module.exports = {
    process: process
};