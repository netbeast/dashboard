// Netbeast App model
// by jesusdario
// CTO @ NetBeast

var path = require('path')

var fs = require('fs-extra')
var Targz = require('tar.gz')
var Decompress = require('decompress')

var self
/* Application constructor */
function App (name) {
  self = this
  self.name = name
}

const APP_BUNDLE = __dirname + '/../bin/bundles/base_app'
const PLUGIN_BUNDLE = __dirname + '/../bin/bundles/base_plugin'
const CURRENT_DIR = process.cwd()

/* Non-static methods and properties */
App.prototype.constructor = App

App.create = function (appName, options) {
  _quitIfExists(appName)

  var destination = path.join(CURRENT_DIR, appName)
  var destJson = path.join(destination, 'package.json')

  var bundle = (options.plugin) ? PLUGIN_BUNDLE : APP_BUNDLE

  console.log("> Creating app '%s'...", appName)
  fs.copySync(bundle, destination)
  var pkgJson = fs.readJsonSync(destJson)
  pkgJson.name = appName
  fs.writeJsonSync(destJson, pkgJson)
  console.log('> The extraction has ended!')
  console.log('> You may want to install app dependences. Type:\n')
  console.log('\t cd ./%s;', appName)
  console.log('\t npm install;\n')
}

App.package = function (dir, options) {
  const from = dir || './'
  const to = options.to || path.join('./', 'app.tar.gz')
  _quitIfNotExists(from)
  _quitIfExists(to)
  console.log('> Packaging app from %s to %s', from, to)
  new Targz().compress(from, to, function (err) {
    if (err) return console.log(err)
    else console.log('> The compression has ended!')
  })
}

App.unpackage = function (file, options) {
  var from = file || './'
  var to = options.to || path.join('./')
  _quitIfNotExists(from)
  console.log('> Unpackaging app from %s to %s', from, to)
  new Decompress().src(from).dest(to)
  .use(Decompress.targz({strip: 1}))
  .run(function (err) {
    if (err) throw err
    console.log('> The extraction has ended!')
  })
}

function _quitIfExists (file) {
  if (fs.existsSync(file)) {
    console.log("> Path '%s' already exists", file)
    process.exit(0)
  }
}

function _quitIfNotExists (file) {
  if (!fs.existsSync(file)) {
    console.log("> Path '%s' does not exists", file)
    process.exit(0)
  }
}

module.exports = App
