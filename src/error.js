var util = require('util')

var error = {}

error.NotFound = function (message) {  
	Error.call(this)
	Error.captureStackTrace(this, arguments.callee)
	this.message = message || 'Not found'
	this.statusCode = 404
}

util.inherits(error.NotFound, Error)

module.exports = error