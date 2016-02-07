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
    log.debug('Start USSD command for detecting number.');

    ussd.process(modem, initCommand, function (num) {
        log.debug('Received response for USSD ression. ', num);
        number = num;
        numberListener(number);
    });
}

function start(initCommand) {
    log.debug('Creating modem connection.');

    modem.open(modemPort, function () {
        log.debug('Modem connection successfully established.');

        startNumberDetecting(initCommand);
        modem.on('sms received', newMessage);
        modem.on('memory full', memoryFull)
    });
}

function restart() {
    var restartCommand = 'AT+CFUN=1,1';
    var delay          = 13000;

    log.debug('Execute modem Restart command.');
    modem.execute(restartCommand, function (escapeChar, response) {
        if (response == 'OK') {
            log.debug('Modem successfully rebooted.')
        } else {
            log.warn('Error on modem rebooting.');
        }

        log.debug('Stopping modem connection.');
        modem.close(modemPort);

        log.debug('Waiting %d seconds for new modem connection.', delay / 1000);
        setTimeout(function () {
            log.debug('Start new modem connection.');
            this.start('*205#');
        }.bind(this), delay);

    }.bind(this), true);
}

module.exports = {
    setMessageListener: function (callback) {
        messageListener = callback;
    },
    setNumberListener : function (callback) {
        numberListener = callback;
    },

    start  : start,
    restart: restart
};