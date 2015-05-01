var express = require('express');
var app = express();
var fs = require('fs');
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/../'));

// This is for local testing only

var port = 8000;
app.listen(port);
console.log('Listening on ' + port);