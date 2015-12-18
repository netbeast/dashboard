
var path = require('path')
var forever = require('forever-monitor')

var config = require('../config')

const DASHBOARD_BIN = path.join(__dirname, '../index.js')

module.exports = function (options) {
  var opts = {
    max: 1,
    killTree: true,
    cwd: __dirname + '/../',
    silent: options.silent,
    args: ['--port', options.port || config.port],
    env: { 'NETBEAST_PORT': options.port || config.port }
  }

  var dashboard = new (forever.Monitor)(DASHBOARD_BIN, opts)
  dashboard.title = 'netbeast'
  dashboard.start()

  process.on('exit', function () {
    console.log('[Dashboard] exit, killing all processes')
    dashboard.kill('SIGTERM')
  })
}
