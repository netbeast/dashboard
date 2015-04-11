/*
* A script to read and interpratate
* the server configuration file 'config.json'
* this is made to simplify accessing to the json,
* now you can type: require('config.js')
* and parse it smart.
*/

var fs = require('fs-extra');
var path = require('path');

var root = path.join(__dirname, '..');
var config = fs.readJsonSync(path.join(root, 'config.json'));

// Parsing and defaults fallback
config.port = config.port || 3000;
config.appsDir = path.resolve(root, config.appsDir) 
	|| path.join(root, './sandbox');
config.tmpDir = path.resolve(root, config.tmpDir)
	|| path.join(root, './tmp');
config.publicDir = path.resolve(root, config.publicDir)
	|| path.join(root, './tmp');

console.log('\n');
console.log('[Default config]');
console.dir(config);
console.log('\n');

module.exports = config;