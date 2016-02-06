module.exports = function () {
    var requests = [];

    return {
        add: function (req) {
            requests.push(req);
        }
    }
};