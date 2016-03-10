
var path = require('path')
var spawn = require('child_process').spawn

const DASHBOARD_BIN = path.join(__dirname, '../index.js')

module.exports = function (options) {
  var opts = {
    max: 1,
    killTree: true,
    cwd: path.resolve(__dirname, '..'),
    silent: options.silent,
    args: ['--port', options.port || process.env.PORT],
    env: { 'NETBEAST_PORT': options.port || process.env.PORT }
  }

  spawn(DASHBOARD_BIN, opts)

  process.on('exit', function () {
    console.log('[Dashboard] exit, killing all processes')
    dashboard.kill('SIGTERM')
  })
}
