// Define error handling:
var error = {}

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
