
var path = require('path')
var spawn = require('child_process').spawn

const DASHBOARD_BIN = path.join(__dirname, '../index.js')

module.exports = function (options) {
  var opts = {
    max: 1,
    killTree: true,
    cwd: path.resolve(__dirname, '..')
  }

  const args = [
    '--port', options.port,
    '--secure_port', options.secure_port,
  ]

  var dashboard = spawn(DASHBOARD_BIN, args, opts)
  dashboard.stdout.on('data', function (data) {
    console.log(data.toString())
  })
  dashboard.stderr.on('data', function (data) {
    console.log(data.toString())
  })
  dashboard.on('error', function (err) {
    console.trace(err)
  })
}
