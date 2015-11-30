#!/usr/bin/env node

// Netbeast app tool suite
// By jesus, NetBeast CTO
// jesus@netbeast.co
// ====================

var path = require('path')

var inquirer = require('inquirer')
var cli = require('commander')
var fs = require('fs-extra')

var App = require('../lib/app')
var scan = require('../lib/scan')
var install = require('../lib/install')
var publish = require('../lib/publish')
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
.action(App.create)

cli.command('package [app]').alias('pkg')
.option('-o, --to <path>', 'Output file name')
.description('Compress your app as tar.gz')
.action(App.package)

cli.command('unpackage [app]').alias('unpkg')
.option('-o, --to <path>', 'Output dir name')
.description('Uncompress your app from tar.gz')
.action(App.unpackage)

cli.command('publish <file>').alias('upload')
.description("Upload your app to the netbeast's repos")
.action(publish)

cli.command('scan').alias('discover')
.description('Find available Netbeasts in range and shows their IP')
.action(scan)

cli.command('install <file> [host]')
.description('Upload an app to a Netbeast remotely')
.action(function (file, host) {
  // 1st param forces silent prompt when not null (jesus, 01/08/15)
  // --dont remember what this comment means (jesus, 03/09/15)

  if (host) {
    return install(file, host)
  }

  scan(function (beasts) {
    if (beasts.length === 0) {
      return // no beasts found
    } else if (beasts.length === 1) {
      install(file, beasts[0])
    } else {
      var question = {
        name: 'netbeast', // question name hash
        message: 'Where do you want to install ' + file + '?',
        choices: beasts.concat('Cancel'),
        type: 'list'
      }

      inquirer.prompt(question, function (answers) {
        if (answers.netbeast === 'Cancel') {
          return console.log('\nBye!\n')
        }

        install(file, answers.netbeast)
      })
    }
  })
})

cli.command('forget')
.description('Reset netbeast-cli configuration')
.action(function () {
  fs.removeSync(__dirname + '/.nconf')
})

cli.parse(process.argv)

// Check the cli.args obj
const NO_COMMAND_SPECIFIED = cli.args.length === 0

// Handle it however you like
if (NO_COMMAND_SPECIFIED) {
  // e.g. display usage
  cli.help()
}
