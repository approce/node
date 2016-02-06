var controller = require('../outRoutes/outSocket');
var outSocket  = require('../outRoutes/outSocket');

var requests       = [];
var requestService = {
    add    : function (req) {
        requests.push(req);
    },
    process: function (msg) {
        var req     = requests[0];
        req.message = msg;
        controller.send(req);
    }
};

outSocket.onNewRequest(requestService.add);

module.exports = requestService;