
var path = require('path')
var forever = require('forever-monitor')

var config = require('../config')

const DASHBOARD_BIN = path.join(__dirname, '../index.js')
const DASHBOARD_DEAMON = path.join(__dirname, '../bin/deamon.js')

var dashboard
var deamon

module.exports = function (options) {
  var opts = {
    max: 1,
    killTree: true,
    cwd: __dirname + '/../',
    silent: options.silent,
    args: ['--port', options.port || config.port],
    env: { 'NETBEAST_PORT': options.port || config.port }
  }

  dashboard = new (forever.Monitor)(DASHBOARD_BIN, opts)
  dashboard.title = 'netbeast'
  dashboard.start()
  deamon = new (forever.Monitor)(DASHBOARD_DEAMON, opts)
  deamon.title = 'netbeast'
  deamon.start()

  process.on('exit', _killProcesses)
}

function _killProcesses () {
  console.log('[Dashboard] exit, killing all processes')
  dashboard.kill()
  deamon.kill()
}
