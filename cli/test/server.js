#!/usr/bin/env node

// server.js
//===========

/*
* This is where all the magic happens.
* The xway dashboard calls this script as is
* `node server.js --port <free port number>`
* after that everyline here will be executed.
*
* You can install extra modules thanks to the work
* of npm. Also you can create a shell script to
* install any missing system package.
*/

/* Requires node.js libraries */
var express = require('express');
var app = express();

// xyos apps can accept the port to be launched by parameters
var argv = require('minimist')(process.argv.slice(2));
port = argv.port || 31416;

if(isNaN(port)) {
	console.log("Port \"%s\" is not a number.", port);
	process.kill(1);
}

app.use(express.static(__dirname));

var server = app.listen(port, function () {
  console.log('Example app listening at http://%s:%s', 
  	server.address().address,
  	server.address().port);
});