// Broker.js is an instance for socket.io
// that logs messages to refactor code

var chalk = require('chalk')

var mqtt = require('mqtt')
var client = mqtt.connect('ws://localhost:' + process.env.PORT)

var broker = module.exports = {}

broker.client = client

broker.client.on('connect', function () {
  console.log('[broker] online')
  broker.client.subscribe('#')
})

client.on('message', function (topic, message) {
  topic = topic.toString()

  try {
    message = JSON.parse(message.toString())
    if (topic === 'netbeast/push') notificationLogger(message)
  } catch (e) {
    console.log('broker got a non JSON object')
    message = message.toString()
  }
  broker.client.emit('#' + topic, message)
})

broker.on = function (topic, cb) {
  broker.client.on(topic, cb)
}

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
  client.publish('netbeast/push', JSON.stringify(msg))
}

function notificationLogger (msg) {
  // Log notification through console
  var str = ''

  msg.emphasis = msg.emphasis || 'info'
  msg.body = ' ' + msg.body + ' '

  switch (msg.emphasis) {
    case 'error':
      str = chalk.bold.bgRed(' #' + msg.title + ' ')
      str = str + chalk.bgRed(msg.body)
      break
    case 'warning':
      str = chalk.bold.bgYellow(' #' + msg.title + ' ')
      str = str + chalk.bgYellow(msg.body)
      break
    case 'info':
      str = chalk.bold.bgCyan(' #' + msg.title + ' ')
      str = str + chalk.bgCyan(msg.body)
      break
    case 'success':
      str = chalk.bold.bgGreen(' #' + msg.title + ' ')
      str = str + chalk.bgGreen(msg.body)
      break
  }

  console.log(str)
}
