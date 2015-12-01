var inquirer = require('inquirer')
var upload = require('./upload')
var scan = require('./scan')

module.exports = function (file, host) {
  // 1st param forces silent prompt when not null (jesus, 01/08/15)
  // --dont remember what this comment means (jesus, 03/09/15)

  if (host) {
    return upload(file, host)
  }

  scan(function (beasts) {
    if (beasts.length === 0) {
      return // no beasts found
    } else if (beasts.length === 1) {
      upload(file, beasts[0])
    } else {
      var question = {
        name: 'netbeast', // question name hash
        message: 'Where do you want to upload ' + file + '?',
        choices: beasts.concat('Cancel'),
        type: 'list'
      }

      inquirer.prompt(question, function (answers) {
        if (answers.netbeast === 'Cancel') {
          return console.log('\nBye!\n')
        }

        upload(file, answers.netbeast)
      })
    }
  })
}
