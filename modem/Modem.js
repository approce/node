var log   = require('winston');
var modem = require('modem').Modem();
var ussd  = require('./ussd');

module.exports = function (numberListener, messageListener) {
    var number;

    return function (port, initCommand) {
        modem.open(port, function () {
            log.debug('Modem opened.');

            modem.on('sms received', function (sms) {
                var index = sms.indexes[0];
                log.debug('New sms received. Index:', index);

                var message = createMessage(number, sms);

                messageListener(message);

                deleteMessages(function (i) {
                    return i == index;
                });
            });

            ussd.process(modem, initCommand, function (num) {
                number = num;
                numberListener(number);
            });

            modem.on('memory full', function () {
                var count;
                log.error('Memory Full! Deleting first %d messages', count);
                deleteMessages(function (i) {
                    return i < count;
                });
            });

            function createMessage(number, sms) {
                sms.text = sms.text.replace(/\0/g, '');
                return {
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
        });
    }
};