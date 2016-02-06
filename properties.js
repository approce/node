var app    = require('express')();
var config = require('./config.json')[app.get('env')];

module.exports = config;