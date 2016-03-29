var portProcessor = require('./PortProcessor');
var Promise       = require('promise');

var TIMEOUT = 10000;

function constructor() {
    var imeiPortMap = {};
    var promises    = {};

    return {
        find  : find,
        search: portProcessor.search.bind(null, portFounded)
    };

    function portFounded(port, imei) {
        imeiPortMap[imei] = port;
        promises[imei] && promises[imei].resolve(port);
    }

    function find(imei) {
        return new Promise(function (resolve, reject) {
            var matchedPort = imeiPortMap[imei];

            matchedPort ? resolve(matchedPort) : addPromise(imei, resolve, reject);
        })
    }

    function addPromise(imei, resolve, reject) {
        var resolved   = false;
        promises[imei] = {
            resolve: function (arguments) {
                resolve(arguments);
                delete  promises[imei];
                resolved = true;
            },
            reject : reject
        };

        setTimeout(function () {
            if (!resolved) {
                console.error('Time out while finding modem with IMEI:', imei);
                reject();
                delete promises[imei];
            }
        }, TIMEOUT)
    }
}

module.exports = constructor;