var EventEmitter = require('events').EventEmitter;
var Modem        = require('modem').Modem;
var log          = require('winston');
var ussd         = require('./ussd');

function createModem(port) {
    var modem = Modem();

    modem.start   = start.bind(null, modem, port);
    modem.restart = restart.bind(null, modem);

    modem.on('sms received', newMessage);
    modem.on('memory full', memoryFull);

    return modem;
}

function start(modem, port) {
    log.debug('Creating modem connection.');

    modem.open(port, function () {
        modem.getMessages(function (array) {
            array.forEach(function (sms) {
                console.log(sms);
            });
        });
        log.debug('Modem connection successfully established.');

        startNumberDetecting(modem);
    });
}

function startNumberDetecting(modem) {
    log.debug('Start USSD session for number detection.');

    //TODO properly get activation code
    ussd.process(modem, "*205#", function (num) {
        log.debug('Received response for USSD session.', num);
        modem.number = num;
        modem.emit('c number detected', num);
    });
}

function restart(modem) {
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
        modem.close(properties.port);

        log.debug('Waiting %d seconds for new modem connection.', delay / 1000);
        setTimeout(function () {
            log.debug('Start new modem connection.');
            this.start();
        }.bind(this), delay);

    }.bind(this), true);
}

function newMessage(sms) {
    log.debug('New sms received.', sms);

    var message = createMessage(this.number, sms);
    this.emit('c sms received', message);

    modem.deleteMessage(sms.indexes[0]);
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

function memoryFull(hz) {
    //TODO should be investigated.
    console.log(hz);
    var modem = this,
        count = 5;

    log.error('Memory Full! Deleting first %d messages', count);

    this.getMessages(function (array) {
        console.log(array);
        array.reverse().forEach(function (sms, i) {
            if (i >= count) {
                return;
            }
            var index = sms.indexes[0];

            log.debug('Deleting message. Index:', index);

            modem.deleteMessage(index);
        })
    });
}

module.exports = createModem;