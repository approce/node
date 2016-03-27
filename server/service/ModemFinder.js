var Promise    = require('promise');
var serialPort = require('serialport');
var SerialPort = serialPort.SerialPort;

var MANUFACTURER_NAME        = 'HUAWEI Technology';
var MANUFACTURER_IMEI_PREFIX = 3588110;
var GET_IMEI_COMMAND         = 'AT+CGSN\r';
var DELAY                    = 10000;

function findPort(imei) {
    return new Promise(function (resolve, reject) {
        serialPort.list(function (err, ports) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            ports.filter(filter).forEach(function (port) {
                tryPort(port, imei, resolve);
            });
        });
    });
}

function filter(port) {
    return port.manufacturer === MANUFACTURER_NAME;
}

function tryPort(portInfo, imei, cb) {
    var portName      = portInfo.comName,
        port          = new SerialPort(portName, {parser: serialPort.parsers.raw}),
        matched       = false,
        isBroadcaster = false,
        required      = true;

    var close = function () {
        port.close(function (err) {
            err && console.error(err);
        });
    };

    port.on('open', function () {
        port.write(GET_IMEI_COMMAND, function (err) {
            err && console.error(err);
        })
    });

    port.on('data', function (data) {
        var datas = data.toString().trim().split('\r');
        //console.log(portName + ': ' + datas[0]);
        datas.forEach(function (entry) {

            //starts with manufacturer imei:
            if (entry.lastIndexOf(MANUFACTURER_IMEI_PREFIX, 0) === 0) {

                if (entry.indexOf(imei) > 0) {
                    matched = true;
                } else {
                    //different imei case:
                    close();
                    return;
                }
            }

            if (entry.indexOf('RSSI') > 0) {
                isBroadcaster = true;
            }

            //broadcasting with imei detected:
            if (required && entry.indexOf('BOOT:' + imei) > 0) {
                finish();
            }

            //matched + broadcasting :
            if (required && matched && isBroadcaster) {
                finish();
            }
        });
    });

    var finish = function () {
        //console.log('matched: ' + portName);
        port.close();
        required = false;
        cb(portName);
        return;
    };

    //close all opened ports after delay time:
    setTimeout(function () {
        port.isOpen() && close();
    }, DELAY)
}

module.exports = {
    find: findPort
};