#!/usr/bin/env node

// Netbeast app tool suite
// By jesus, NetBeast CTO
// jesus@netbeast.co
// ====================

var path = require('path')

var cli = require('commander')
var fs = require('fs-extra')
var App = require('../lib/app')
var scan = require('../lib/scan')
var install = require('../lib/install')
var publish = require('../lib/publish')
var start = require('../lib/start')
var didYouMean = require('didyoumean')

const ACTIONS_LIST = ['new', 'create', 'package', 'pkg', 'unpackage', 'unpkg', 'publish', 'scan', 'install', 'forget', 'start']

var pkg = require('../package.json')

cli.version(pkg.version)

// Init nconf file
var nconf_path = path.join(__dirname, '.nconf')
if (!fs.existsSync(nconf_path)) {
  fs.writeJsonSync(nconf_path, {})
}

cli.command('new <app>').alias('create')
.description('Create the basic app structure')
.option('--cloud', 'Allow thethings.io integration')
.option('--plugin', 'Create the basic plugin struture (no App)')
.action(App.create)

cli.command('package [app]').alias('pkg')
.option('-o, --to <path>', 'Output file name')
.description('Compress your app as tar.gz')
.action(App.package)

cli.command('unpackage [app]').alias('unpkg')
.option('-o, --to <path>', 'Output dir name')
.description('Uncompress your app from tar.gz')
.action(App.unpackage)

cli.command('publish <file>')
.description("Upload your app to the netbeast's repos")
.action(publish)

cli.command('scan').alias('discover')
.description('Find available Netbeasts in range and shows their IP')
.action(scan)

cli.command('install <file> [host]')
.description('Upload an app to a Netbeast remotely')
.action(install)

cli.command('forget')
.description('Reset netbeast-cli configuration')
.action(function () {
  fs.removeSync(__dirname + '/.nconf')
})

cli.command('start')
.description('Launches netbeast dashboard')
.option('--silent', 'Capture dashboard output on console')
.option('-p, --port <n>', 'Port to start the HTTP server', parseInt)
.action(start)

cli.parse(process.argv)

// No command specified or unrecognaized command
if (cli.args.length === 0) {
  cli.help()
}
if (ACTIONS_LIST.indexOf(process.argv[2]) === -1) {
  didYouMean.threshold = null
  var matched = didYouMean(process.argv[2], ACTIONS_LIST)
  if (matched != null) {
    console.log('\n\tDid you mean "' + didYouMean(process.argv[2], ACTIONS_LIST) + '"?')
    console.log('\n\tType "beast ' + matched + ' -h" to know its parameters' + '\n')
  } else {
    cli.help()
  }
}
