var chalk = require('chalk')

module.exports = function (socket) {
  console.log(chalk.grey('user connected'))

  socket.on('push', function (str) {
    var from = socket.handshake.address
    console.log('I received a private message by ', from, ' saying ', str)
    console.log('routing...')
    socket.broadcast.emit('news', str)
  })

  socket.on('disconnect', function () {
    console.log(chalk.grey('user disconnected'))
  })
}
