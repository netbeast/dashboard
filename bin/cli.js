#!/usr/bin/env node

// Netbeast app tool suite
// By jesus, NetBeast CTO
// jesus@netbeast.co
// ====================

require('../lib/init')

var path = require('path')
var cli = require('commander')
var fs = require('fs-extra')

var App = require('../lib/app')
var scan = require('../lib/scan')
var start = require('../lib/start')
var api = require('../lib/api')

var pkg = require('../package.json')

cli.version(pkg.version)

// Init nconf file
var nconf_path = path.join(__dirname, '.nconf')
if (!fs.existsSync(nconf_path)) {
  fs.writeJsonSync(nconf_path, {})
}

cli.command('new <app>').alias('create')
.description('Create the basic app structure')
.option('--plugin', 'Create the basic plugin struture (no App)')
.action(App.create)

// cli.command('publish <file>')
// .description("Upload your app to the netbeast's repos")
// .action(publish)

cli.command('scan').alias('discover')
.description('Find available Netbeasts in the subnet')
.action(scan)

// cli.command('install <file> [host]')
// .description('Upload an app to a Netbeast remotely')
// .action(install)

cli.command('forget')
.description('Reset netbeast-cli configuration')
.action(function () {
  fs.removeSync(__dirname + '/.nconf')
})

cli.command('start')
.description('Launches netbeast dashboard')
.option('-p, --port <n>', 'Port to start the HTTP server', parseInt)
.option('-sp, --secure_port <n>', 'Secure port to start the HTTPS server', parseInt)
.action(start)

cli.command('uninstall <app>')
.description('Uninstall an app')
.action(api.uninstall)

cli.command('stop <app>')
.description('Stops a running app')
.action(api.stop)

cli.command('restart <app>')
.description('Restarts a running app')
.action(api.restart)

cli.command('launch <app>')
.description('Launches an installed app')
.action(api.launch)

cli.parse(process.argv)

// No command specified or unrecognaized command
if (cli.args.length === 0) {
  cli.help()
}
