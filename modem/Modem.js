var modem = require('modem').Modem();
var ussd  = require('./ussd');

module.exports = function (numberListener, messageListener) {
    var number;

    return function (port, initCommand) {
        modem.open(port, function () {

            modem.on('sms received', function (sms) {
                var message = createMessage(sms);
                messageListener(number, message);
                deleteMessages(function (i) {
                    return i == sms.indexes[0];
                });
            });

            ussd.process(modem, initCommand, function (num) {
                number = num;
                numberListener(num);
            });

            modem.on('memory full', function () {
                console.error('Memory Full! Deleting first 5 messages');
                deleteMessages(function (i) {
                    return i < 5;
                });
            });

            function createMessage(number, sms) {
                sms.text = sms.text.replace(/\0/g, '');
                return {
                    sim_id    : number,
                    originator: sms.sender,
                    recieved  : sms.time,
                    text      : sms.text
                };
            }

            function deleteMessages(cause) {
                modem.getMessages(function (array) {
                    array.forEach(function (item, i) {
                        cause(i, item) ? modem.deleteMessage(i) : false;
                    })
                });
            }
        });
    }
};