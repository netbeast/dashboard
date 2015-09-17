
// Broker.js is an instance for socket.io
// that logs messages to refactor code

var mqtt = require('mqtt')
, chalk = require('chalk')

module.exports = broker = {}

var client  = mqtt.connect('ws://localhost:1883')


// Method to emit info as Dashboard and parse it easily
broker.emit = function (emphasis, data) {
	var args = [].slice.call(arguments, 1)
	, notif = {title: 'Dashboard'}
	
	// Log io.emit through console
	console.log(chalk.bgCyan('ws') + chalk.bgYellow(args))

	// Enable broker to emit a string as 
	// console.log fashion
	if (typeof data === 'String')
		data = parse(args)

	notif.body = data
	notif.emphasis = emphasis
	client.publish('notifications', JSON.stringify(notif))
}

broker.notify = function (notification) {
	
	console.log('## NOTIFY ##')
	// Log notification through console
	console.log(chalk.bgCyan('ws') 
		+ chalk.bgYellow(notification.toString()))

	client.publish('notifications',
		JSON.stringify(notification))
}


function parse(str) {
	var args = [].slice.call(arguments, 1),
	i = 0

	return str.replace(/%s/g, function() {
		return args[i++]
	})
}