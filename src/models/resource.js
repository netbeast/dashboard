var util = require('util')

var Promise = require('bluebird')
var chalk = require('chalk')
var _ = require('lodash')

var helper = require('../helpers/resource')
var ApiError = require('../util/api-error')

const macRegex = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/
const ipRegex = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/

helper.createTable(function (err, data) {
  if (err) throw err
})

function Resource (item) {

  this.id = item.id
  this.app = item.app
  this.location = item.location
  this.topic = item.topic
  this.groupname = item.groupname
  this.hook = item.hook

  try {
    const hookTail = item.hook.split('/')[item.hook.split('/').length - 1]
    if (macRegex.test(hookTail)) this.mac = hookTail
    if (ipRegex.test(hookTail)) this.ip = hookTail
  } catch (e) { /* console.log(chalk.grey('[warning] rosources without hook')) */ }
}

Resource.create = function (item, done) {
  return (new Resource(item)).save(done)
}

Resource.prototype.destroy = function (done) {
  helper.deleteAction(this.id, function (err) {
    if (err) return done(err)

      if (typeof done === 'function') return done(null)
    })
}

Resource.find = function (query, done) {
  var result = []
  helper.findAction(query, function (err, row) {
    if (err) return done(err)
      if (_.isEmpty(row)) return done(new ApiError(404, 'Resource not found DB'))

      row.forEach(function (action) {
        result.push(new Resource(action))
      })

      return done(null, result)
    })
}

Resource.findOne = function (query, done) {
  helper.findAction(query, function (err, row) {
    if (err) return done(err)
      if (row.length < 1) return done(new ApiError(404, 'Resource not found DB'))

        return done(null, new Resource(row[row.length - 1]))
    })
}

Resource.prototype.save = function (done) {
  var self = this
  var schema = {
    app: this.app,
    location: this.location,
    topic: this.topic,
    groupname: this.groupname,
    hook: this.hook
  }
  helper.insertAction(schema,	function (err) {
    if (err) return done(err)

      Resource.findOne({app: self.app}, done)
  })
}

Resource.update = function (query, value, done) {
  helper.updateAction(query, value, function (err) {
    if (err) return done(err)

      return done()
  })
}

Resource.destroy = function (query, done) {
  Resource.find(query, function (err, resources) {
    console.log(err)
    if (err && err.statusCode !== 404) {
      return done(err)
    }

    if (!resources || _.isEmpty(resources)) {
      if (typeof done === 'function') return done(null, 0)
    } else {
      Promise.map(resources, function (item) {
        return new Promise(function (resolve, reject) {
          item.destroy(function (err) {
            if (err) return reject(err)
            return resolve()
          })
        })
      }).then(function () {
        if (typeof done === 'function') return done()
      }).catch(done)
    }
  })
}

module.exports = Resource
