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


// Forbidden error list
error.list = {
  errorMime: 'Invalid file type. Must be a zip or tar.gz.',
  noPkgJson: 'App does not have package.json file.',
  badJson: 'Bad formatted package.json file.',
  appExists: 'App already exists.',
  noMainExe: "No valid 'main' field in package.json.",
  noInstall: 'Could not install the app.',
  database: 'Database connection error.'
}

error.handle = function (code, response) {
  console.log(error.list[code])
  response.status(403).json(error.list[code])
}

module.exports = error
