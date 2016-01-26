var util = require('util')

var text = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  408: 'Request Timeout',
  415: 'Unsupported Media Type',
  422: 'Unprocessable Entity',
  426: 'Upgrade Required',
  500: 'Intenal Server Error',
  501: 'Not Implemented'
}

function ApiError (code, message) {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.message = message || text[code] || 'Internal Server Error'
  this.statusCode = code || 500
}

util.inherits(ApiError, Error)

module.exports = ApiError
