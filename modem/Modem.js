var log       = require('winston');
var modem     = require('modem').Modem();
var ussd      = require('./ussd');
var modemPort = require('../properties').modemPort;

var number;
var messageListener;
var numberListener;

function newMessage(sms) {
    log.debug('New sms received. Index:', sms.indexes[0]);

    var message = createMessage(number, sms);

    messageListener(message);

    deleteMessages(function (i) {
        return i == sms.indexes[0];
    });
}

function createMessage(number, sms) {
    sms.text = sms.text.replace(/\0/g, '');
    sms.id   = sms.time.toString().hashCode();
    return {
        id        : sms.id,
        sim_id    : number,
        originator: sms.sender,
        received  : sms.time,
        text      : sms.text
    };
}

function deleteMessages(cause) {
    modem.getMessages(function (array) {
        array.forEach(function (item, i) {
            if (cause(i, item)) {
                log.debug('Deleting message. Index:', i);
                modem.deleteMessage(i);
            }
        })
    });
}

function memoryFull() {
    var count = 5;
    log.error('Memory Full! Deleting first %d messages', count);
    deleteMessages(function (i) {
        return i < count;
    });
}

function startNumberDetecting(initCommand) {
    ussd.process(modem, initCommand, function (num) {
        number = num;
        numberListener(number);
    });
}
module.exports = {
    setMessageListener: function (callback) {
        messageListener = callback;
    },
    setNumberListener : function (callback) {
        numberListener = callback;
    },

    start: function (initCommand) {
        log.debug('Opening modem.');

        modem.open(modemPort, function () {
            log.debug('Modem opened.');

            startNumberDetecting(initCommand);
            modem.on('sms received', newMessage);
            modem.on('memory full', memoryFull)
        });
    }
};