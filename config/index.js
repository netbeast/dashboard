/*
* A script to read and interpratate
* the server configuration file 'config.json'
* this is made to simplify accessing to the json,
* now you can type: require('config.js')
* and parse it smart.
*/

var fs = require('fs-extra');
var path = require('path');

/*
* You could also write in this folder a 
* config.json with this structure to change
* the dashboard configuration: 
{
	port : 3000,
	appsDir : "/your/apps/",
	tmpDir : "/the/tmp/dir",
	publicDir : "/your/public-assets"
	(don't change 'publicDir' unless you know what you are doing)	
}
*/

var root = path.join(__dirname, '..')
, userFile = path.join(__dirname, 'user.json')
, configFile = path.join(__dirname, 'config.json');

var defaultConfig = {
	port : 80,
	tmpDir : '/tmp',
	appsDir : path.join(root, './sandbox'),
	publicDir : path.join(root, './public'),
	user : fs.readJsonSync(userFile, {throw: false})
};

var config = fs.readJsonSync(configFile,	
	{throws: false}) || defaultConfig;

config.getUser = function() {
	return fs.readJsonSync(userFile, {throw: false});
}

console.log('\n');
console.log('[Default config]');
console.dir(config);
console.log('\n');

module.exports = config;