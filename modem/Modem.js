var modem      = require('modem').Modem();
var ussd       = require('./ussd');
module.exports = {
    number: null,
    start : function (port, initCommand, numberListener, messageListener) {

        modem.open(port, function () {
            var number;
            modem.on('sms received', function (sms) {
                console.log(sms.text);
                console.log('filtered: ' + sms.text.replace(/\0/g, ''));
                messageListener({
                    sim_id    : number,
                    originator: sms.sender,
                    recieved  : sms.time,
                    text      : sms.text.replace(/\0/g, '')
                });
            });

            ussd.process(modem, initCommand, function (num) {
                number = num;
                numberListener(num);
            });

            modem.getMessages(function (messages) {
                messages.forEach(function (item, i) {
                    modem.deleteMessage(i, function () {
                    })
                })
            });

            modem.on('memory full', function () {
                console.error('Memory Full!!');

                modem.getMessages(function (messages) {
                    messages.forEach(function (item, i) {
                        modem.deleteMessage(i, function () {
                        })
                    })
                })
            });


        });
    }
};