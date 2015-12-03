// Some helper methods:
// ====================

/* global angular, toastr */

var md5 = require('md5')

var self = module.exports = {}

self._validateUserForm = function (user) {
  if (!user.alias) {
    toastr.warning('Please type an alias')
    return false
  } else if (!user.email) {
    toastr.warning('Please type a valid email address')
    return false
  } else if (self._validatePasswords(user)) {
    return true
  } else {
    // unless passwords and all fields are validated
    return false
  }
}

self._validatePasswords = function (user) {
  if (!user.password) {
    toastr.warning('Please type your password')
    return false
  } else if (user.password.length < 6) {
    toastr.warning('It should have more characters', 'Password should be more secure')
    return false
  } else if (!user.password_confirmation) {
    toastr.warning('Please confirm your password')
    return false
  } else if (user.password !== user.password_confirmation) {
    toastr.warning('Passwords do not match')
    return false
  } else {
    return true
  }
}

self._hashPasswords = function (user) {
  var aux = {}
  angular.copy(user, aux)
  aux.password = md5(user.password)
  if (user.password_confirmation) {
    aux.password_confirmation = md5(user.password_confirmation)
  }
  return aux
}
