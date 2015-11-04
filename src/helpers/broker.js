
// Broker.js is an instance for socket.io
// that logs messages to refactor code

var mqtt = require('mqtt')
var chalk = require('chalk')
var _ = require('lodash')

var broker = module.exports = {}

var client = mqtt.connect('ws://localhost:1883')
client.on('error', function (data) {
  console.log(data)
})

broker.notify = function (notification) {
  var _n = notification

  // Log notification through console
  var msg = chalk.bgCyan('ws')
  switch (_n.emphasis) {
    case 'error':
    msg = msg + chalk.bgRed(_n.body)
    break
    case 'warning':
    msg = msg + chalk.bgYellow(_n.body)
    break
    case 'info':
    msg = msg + chalk.bgBlue(_n.body)
    break
    case 'success':
    msg = msg + chalk.bgGreen(_n.body)
    break
    default:
  }

  console.log(msg)
  client.publish('notifications', JSON.stringify(_n))
}

broker.info = function (notification) {
  if (typeof notification === 'string') {
    broker.notify({ emphasis: 'info', body: notification })
  } else {
    broker.notify(_.extend(notification, { emphasis: 'info' }))
  }
}

broker.error = function (notification) {
  if (typeof notification === 'string') {
    broker.notify({ emphasis: 'error', body: notification })
  } else {
    broker.notify(_.extend(notification, { emphasis: 'error' }))
  }
}

broker.success = function (notification) {
  if (typeof notification === 'string') {
    broker.notify({ emphasis: 'success', body: notification })
  } else {
    broker.notify(_.extend(notification, { emphasis: 'success' }))
  }
}

broker.warning = function (notification) {
  if (typeof notification === 'string') {
    broker.notify({ emphasis: 'warning', body: notification })
  } else {
    broker.notify(_.extend(notification, { emphasis: 'warning' }))
  }
}

broker.info = broker.notify // alias
