var request = require('request')
var async = require('async')
var fs = require('fs')
var sha1 = require('sha1')
var inquirer = require('inquirer')
var Spinner = require('cli-spinner').Spinner
var validateApp = require('./util/validate-app')
var nconf = require('nconf')

nconf.file('.nconf')

module.exports = function (app) {
  if (!validateApp(app)) {
    return console.error('Invalid file type. Must be a tar.gz')
  }

  var login = 'https://netbeast.co/api/login'
  var push = 'https://netbeast.co/api/apps'
  var cookies = request.jar()
  var spinner // loading icon

  var questions = [{
    name: 'email',
    message: 'Type your netbeast account email',
    type: 'type'
  }, {
    name: 'password',
    message: 'Type your netbeast account password',
    type: 'password',
    filter: sha1
  }]

  async.waterfall([
    function (callback) {
      if (nconf.get('answers')) {
        callback(null, nconf.get('answers'))
      } else {
        inquirer.prompt(questions, function (answers) {
          nconf.set('answers', answers)
          callback(null, answers)
        })
      }
    },
    function (answers, callback) {
      request.post({url: login, jar: cookies, json: answers}, callback)
    }, function (resp, body, callback) {
      if (resp.statusCode !== 200) {
        return console.log('Login incorrect')
      }

      // save user email and pass
      nconf.save(function (err) {
        if (err) throw err
      })

      // loading symbol
      spinner = new Spinner('Pushing app to market... %s')
      spinner.setSpinnerString('|/-\\')
      spinner.start()

      // pushing app
      var req = request.post({url: push, jar: cookies}, callback)
      var form = req.form()
      form.append('file', fs.createReadStream(app))
    }], function (err, resp, body) {
      if (err) throw err
      spinner.stop()
      console.log('\n%s responded code %s\n%s',
      push, resp.statusCode, body)
    })
  }
