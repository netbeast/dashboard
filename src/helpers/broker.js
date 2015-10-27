
// Broker.js is an instance for socket.io
// that logs messages to refactor code

var mqtt = require('mqtt')
var chalk = require('chalk')
var _extend = require('lodash/object/extend')

var broker = module.exports = {}

var client = mqtt.connect('ws://localhost:1883')
client.on('error', function (data) {
  console.log(data)
})

// Method to emit info as Dashboard and parse it easily
broker.emit = function (emphasis, data) {
  var args = [].slice.call(arguments, 1)
  var notif = {title: 'Dashboard'}

  // Log io.emit through console
  console.log(chalk.bgCyan('ws') + chalk.bgYellow(args))

  // Enable broker to emit a string as
  // console.log fashion
  if (typeof data === 'String') data = _parse(args)

  notif.body = data
  notif.emphasis = emphasis
  client.publish('notifications', JSON.stringify(notif))
}

broker.notify = function (notification) {
  // Log notification through console
  console.log(chalk.bgCyan('ws') + chalk.bgYellow(JSON.stringify(notification)))
  client.publish('notifications', JSON.stringify(notification))
}

broker.error = function (notification) {
  broker.notify(_extend(notification, { emphasis: 'error' }))
}

broker.success = function (notification) {
  broker.notify(_extend(notification, { emphasis: 'success' }))
}

broker.warning = function (notification) {
  broker.notify(_extend(notification, { emphasis: 'warning' }))
}

broker.info = broker.notify // alias

function _parse (str) {
  var args = [].slice.call(arguments, 1)
  var i = 0

  return str.replace(/%s/g, function () {
    return args[i++]
  })
}
