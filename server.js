var config = require('./config');
var handler = require('./handler');
var errorhandler = require('errorhandler');
var passport = require('passport');
var express = require('express');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app = express();

app.use (function(req, res, next) {
    var bodyChunks = [];
    req.on('data', function(chunk) {
       bodyChunks.push(chunk);
    });

    req.on('end', function() {
        req.body = Buffer.concat(bodyChunks);
        next();
    });
});

//app.use(errorhandler({log: log.error}))

app.use(function (req, res, next) {
    "use strict";
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'HEAD, POST, PUT, GET, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'origin, content-type, X-Auth-Token, Tenant-ID, Authorization, x-organicity-application, x-organicity-experiment');
    //log.debug("New Request: ", req.method);
    if (req.method == 'OPTIONS') {
        log.debug("CORS request");
        res.statusCode = 200;
        res.header('Content-Length', '0');
        res.send();
        res.end();
    }
    else {
        next();
    }
});

var port = config.port || 80;
app.set('port', port);

var chain = [];
for(var i = 0; i < config.tests.length; i++) {
    chain.push(handler.isPortTaken(config.tests[i]));
}

app.get('/', chain, handler.finish(config.tests));

console.log('Starting Node-Port-Uses server on port ' + port + '.');

app.listen(app.get('port'));
