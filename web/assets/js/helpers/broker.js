
// Broker.js is an instance for socket.io
// that logs messages to refactor code

module.exports = broker = {}

broker.handle = function (topic, msg) {
	var t = JSON.parse(msg.toString())
	console.log('%s\n%s', topic, msg.toString())
	switch (t.emphasis) {
		case 'error':
		case 'warning':
		case 'success':
		toastr[t.emphasis](t.body, t.title)
		break
		default:
		toastr.info(t.body, t.title)
	}
}