var helper = require('../helpers/resource')
var ApiError = require('../util/api-error')

const macRegex = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/
const ipRegex = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/

helper.createTable(function (err, data) {
  if (err) throw err
})

function Resource (item) {

  const hookTail = item.hook.split('/')[item.hook.split('/').length - 1]

  this.id = item.id
  this.app = item.app
  this.location = item.location
  this.topic = item.topic
  this.groupname = item.groupname
  this.hook = item.hook

  if (macRegex.test(hookTail)) this.mac = hookTail
  if (ipRegex.test(hookTail)) this.ip = hookTail
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
    if (!row.length) return done(new ApiError(404, 'Resource not found DB'))

    row.forEach(function (action) {
      result.push(new Resource(action))
    })
    return done(null, result)
  })
}

Resource.findOne = function (query, done) {
  helper.findAction(query, function (err, row) {
    if (err) return done(err)
    if (!row.length) return done(new ApiError(404, 'Resource not found DB'))

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

module.exports = Resource
