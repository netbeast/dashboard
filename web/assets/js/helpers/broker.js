/* global toastr*/

// Broker.js is an instance for socket.io
// that logs messages to refactor code

// REVISION THIS IN ORDER TO CHANGE OR NOT TOWARDS WEBSOCKETS
// -- CHANCES ARE THAT YES

var broker = module.exports = {}

broker.handle = function (topic, msg) {
  var t = JSON.parse(msg.toString())
  switch (t.emphasis) {
    case 'error':
    case 'warning':
    case 'success':
      toastr[t.emphasis](t.body.toString(), t.title)
      break
    default:
      toastr.info(t.body, t.title)
  }
}
