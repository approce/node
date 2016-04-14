var EventEmitter = require('events').EventEmitter;
var Modem        = require('modem').Modem;
var log          = require('winston');
var Ussd         = require('./Ussd');

function createModem(port, initCommand) {
    var modem = Modem();

    modem.start   = start.bind(null, modem, port, initCommand);
    modem.restart = restart.bind(null, modem);

    return modem;
}

function start(modem, port, initCommand) {
    log.debug('Creating modem connection.');

    modem.open(port, function () {
        modem.on('sms received', newMessage.bind(modem));
        modem.on('memory full', memoryFull);

        setMessageStorage(modem);
        //deleteAllMessages(modem);
        checkStorage(modem);
        log.debug('Modem connection successfully established.');

        startNumberDetecting(modem, initCommand);
    });
}

function deleteAllMessages(modem) {
    modem.getMessages(function (res) {
        console.log(res);
        console.log('deleting ', res.length);
        res.forEach(function (message) {
            modem.deleteMessage(message.indexes[0]);
        });
    });
}

function setMessageStorage(modem) {
    modem.execute('AT+CPMS="MT","MT","MT"');
}

function startNumberDetecting(modem, initCommand) {
    log.debug('Start USSD session for number detection.');

    new Ussd(modem).start(initCommand).then(function (num) {
        log.debug('Received response for USSD session.', num);
        modem.number = num;
        modem.emit('c number detected', num);
    });
}

function checkStorage(modem) {
    modem.execute('at+cpms?', function (data) {
        console.log(data);
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

    this.deleteMessage(sms.indexes[0]);
}

function createMessage(number, sms) {
    sms.text = sms.text.replace(/\0/g, '');
    return {
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