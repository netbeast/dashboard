
// Broker.js is an instance for socket.io
// that logs messages to refactor code

var chalk = require('chalk')
var config = require('../../config')

var io = require('socket.io-client')
var socket = io.connect(config.LOCAL_URL)

var broker = module.exports = {}

// title is optional
broker.info = function (body, title) {
  broker.emit({ emphasis: 'info', body: body, title: title })
}

broker.error = function (body, title) {
  broker.emit({ emphasis: 'error', body: body, title: title })
}

broker.success = function (body, title) {
  broker.emit({ emphasis: 'success', body: body, title: title })
}

broker.warning = function (body, title) {
  broker.emit({ emphasis: 'warning', body: body, title: title })
}

broker.emit = function (msg) {
  // Log notification through console
  var str = chalk.bgCyan('ws') +
  chalk.bold.bgCyan(msg.title || '::')

  switch (msg.emphasis) {
    case 'error':
      str = str + chalk.bgRed(msg.body)
      break
    case 'warning':
      str = str + chalk.bgYellow(msg.body)
      break
    case 'info':
      str = str + chalk.bgBlue(msg.body)
      break
    case 'success':
      str = str + chalk.bgGreen(msg.body)
      break
    default:
      break
  }

  console.log(str)
  socket.emit('push', msg)
}
