var controller = require('../routes/outSocket');
var outSocket  = require('../routes/outSocket');

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