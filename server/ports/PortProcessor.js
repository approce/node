var serialPort = require('serialport');
var SerialPort = serialPort.SerialPort;

var MANUFACTURER_NAME        = 'HUAWEI Technology';
var MANUFACTURER_IMEI_PREFIX = 3588110;
var GET_IMEI_COMMAND         = 'AT+CGSN\r';
var TIMEOUT                  = 10000;

function search(cb) {
    var map = {};

    serialPort.list(function (err, ports) {
        if (err) {
            console.error(err);
            return;
        }

        ports.filter(filterByManufacturer).forEach(run.bind(null, map, cb));
    });
}

function filterByManufacturer(port) {
    return port.manufacturer === MANUFACTURER_NAME;
}

function run(map, cb, portInfo) {
    var portName  = portInfo.comName,
        portEntry = map[portName] = {},
        port = new SerialPort(portName, {parser: serialPort.parsers.raw});

    port.on('open', sendGetImeiCommand.bind(port));

    port.on('data', processModemData.bind(port, portEntry, portName));

    port.on('custom:matched', finishPort.bind(port, cb));

    setTimeout(function () {
        port.isOpen() && port.close();
    }, TIMEOUT);
}

function sendGetImeiCommand() {
    this.write(GET_IMEI_COMMAND, function (err) {
        err && console.error(err);
    });
}

function processModemData(portEntry, portName, data) {
    data = filterModemsData(data);

    var broadcasterAndContainsImei = isBroadcasterAndContainsImei(data);
    if (broadcasterAndContainsImei) {
        portEntry.imei          = broadcasterAndContainsImei;
        portEntry.isBroadcaster = true;
        this.emit('custom:matched', portName, portEntry.imei);
        return;
    }

    portEntry.imei          = findImei(data) || portEntry.imei;
    portEntry.isBroadcaster = isBroadcaster(data) || portEntry.isBroadcaster;

    if (portEntry.imei && portEntry.isBroadcaster) {
        this.emit('custom:matched', portName, portEntry.imei);
    }
}

function finishPort(cb, portName, imei) {
    this.close();
    cb(portName, imei);
}

function filterModemsData(response) {
    return response.toString().trim().split('\r').filter(function (str) {
        return str != 'OK' && str != '\r' || str.indexOf('AT+') > -1;
    })[0];
}

function isBroadcasterAndContainsImei(data) {
    if (data.indexOf('BOOT') > -1) {
        return data.substring(6, 14);
    }
}

function findImei(data) {
    //starts with manufacturer imei:
    if (data.lastIndexOf(MANUFACTURER_IMEI_PREFIX, 0) === 0) {
        //return only model imei part:
        return data.substring(7, 15);
    }
}

function isBroadcaster(data) {
    return data.indexOf('RSSI') > -1;
}

module.exports = {
    search: search
};