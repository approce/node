var router          = require('express').Router();
var requestsService = require('../service/requestsService')();

router.post('/requests', function (req, resp) {
    //TODO validate.
    requestsService.add(req.body);
});