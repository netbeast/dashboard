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
var http = require('http');
var fs = require('fs');

var argv = require('minimist')(process.argv.slice(2)); // must-have package

/* xyos apps need to accept the port to be launched by parameters */
port = argv.port;

if(isNaN(port)) {
	console.log("Port \"" + port + "\" is not a number.");
	process.kill(1);
} else {
	console.log("Listening on port " + port);
}


http.createServer(function(request, response) {
	/* index.html is an user interface example */
	fs.readFile('index.html', 'utf8', function (error, data) {
		if (error) {
			return console.log(error);
		}
		response.writeHeader(200, {"Content-Type": "text/html"});
		response.write(data);
		response.end();
	});

}).listen(port);
