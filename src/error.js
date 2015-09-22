var util = require('util')

var error = {}

error.NotFound = function (message) {  
	Error.call(this)
	Error.captureStackTrace(this, arguments.callee)
	this.message = message || 'Not found'
	this.statusCode = 404
}



error.InvalidFormat = function (message) {
	Error.call(this)
	Error.captureStackTrace(this, arguments.callee)
	this.message = message || 'Invalid Format'
	this.statusCode = 403
}

util.inherits(error.NotFound, Error)
util.inherits(error.InvalidFormat, Error)


module.exports = error
