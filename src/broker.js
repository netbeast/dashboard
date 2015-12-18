var chalk = require('chalk')

var n_users = 0
module.exports = function (socket) {
  n_users++
  console.log(chalk.grey('[broker] :connection: %s users'), n_users)
  socket.on('push', function (msg) {
    socket.broadcast.emit('news', msg)
  })

  socket.on('disconnect', function () {
    console.log(chalk.grey('[broker] :disconnection: %s users'), n_users)
  })
}
