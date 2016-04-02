var log         = require('winston');
var UssdSession = require('modem').Ussd_Session;

var RESPONSE_TIMEOUT = 10000;
var TRIES            = 3;

function constructor(modem) {
    var session   = new UssdSession();
    session.setTimeout(RESPONSE_TIMEOUT);
    session.modem = modem;

    return {
        start: start.bind(null, session)
    };
}

function start(session, command) {
    return new Promise(function (resolve, reject) {
        session.execute = function () {
            this.query(command, function (code, response) {
                resolve(parseNumber(response));
            });
        };
        session.start();
    });
}

function parseNumber(msg) {
    return Math.max.apply(null, msg.match(/\d+/g));
}

module.exports = constructor;