/*
* A script to read and interpratate
* the server configuration file 'config.json'
* this is made to simplify accessing to the json,
* now you can type: require('config.js')
* and parse it smart.
*/

var fs = require('fs-extra')
, async = require('async')
, exec = require('child_process').exec
, path = require('path')
, launcher = require('../src/launcher')


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
, configFile = path.join(__dirname, 'config.json')


var defaultConfig = {
	port : 80,
	tmpDir : '/tmp',
	configDir: __dirname,
	sandbox : path.join(root, './.sandbox'),
	publicDir : path.join(root, './public'),
	appsDir : path.join(root, './.sandbox/node_modules'),
	user : fs.readJsonSync(userFile, {throw: false})
}

var config = fs.readJsonSync(configFile,	
	{throws: false}) || defaultConfig

module.exports = config

config.getUser = function() {
	return fs.readJsonSync(userFile, {throw: false})
}

console.log('[Default config]')
console.dir(config)


// start apps that must be initialized on boot
fs.readdir(config.appsDir, function (err, files) {
	if (err)
		throw err

	async.map(files, function(file, callback) {
		var pkgJson = path.join(config.appsDir, file, 'package.json')
		fs.readJson(pkgJson, function (err, data) {
			if (err)
				callback(err)
			else if (data.bootOnLoad)
				launcher.boot(file, function(err, port) {
					if (err)
						throw err
					console.info('launched app on port %s', port)
				})
		})
	})
})