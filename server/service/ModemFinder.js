var serialPort = require('serialport');
var SerialPort = serialPort.SerialPort;

var MANUFACTURER_NAME = 'HUAWEI Technology';
var GET_IMEI_COMMAND  = 'AT+CGSN\r';
var DELAY             = 10000;

function findPort(imei, cb) {
    serialPort.list(function (err, ports) {
        err && console.error(err);

        ports.filter(filter).forEach(function (port) {
            tryPort(port, imei, cb);
        });
    })
}

function filter(port) {
    return port.manufacturer === MANUFACTURER_NAME;
}

function tryPort(portInfo, imei, cb) {
    var portName      = portInfo.comName,
        port          = new SerialPort(portName, {parser: serialPort.parsers.raw}),
        matched       = false,
        isBroadcaster = false,
        close         = function () {
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
        data.toString().trim().split('\r').forEach(function (entry) {
            console.log(entry);
            if (entry === imei) {
                matched = true;
            }

            if (entry.indexOf('RSSI') > 0) {
                isBroadcaster = true;
            }

            if (matched && isBroadcaster) {
                cb(portName);
                close();
                return;
            }
        });
    });

    //close all opened ports after delay time:
    setTimeout(function () {
        port.isOpen() && close();
    }, DELAY)
}

module.exports = {
    find: findPort
};