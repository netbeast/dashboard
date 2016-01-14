
var path = require('path')
var forever = require('forever-monitor')

const DASHBOARD_BIN = path.join(__dirname, '../index.js')

module.exports = function (options) {
  var opts = {
    max: 1,
    killTree: true,
    cwd: __dirname + '/../',
    silent: options.silent,
    args: ['--port', options.port || process.env.PORT],
    env: { 'NETBEAST_PORT': options.port || process.env.PORT }
  }

  var dashboard = new (forever.Monitor)(DASHBOARD_BIN, opts)
  dashboard.title = 'netbeast'
  dashboard.start()

  process.on('exit', function () {
    console.log('[Dashboard] exit, killing all processes')
    dashboard.kill('SIGTERM')
  })
}
