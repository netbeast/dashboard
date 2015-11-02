var helper = require('../lib/resource')

helper.createTable(function (err, data) {
  if (err) throw err
})

function Resource (item) {
  this.id = item.id
  this.app = item.app
  this.location = item.location
  this.topic = item.topic
  this.groupname = item.groupname
  this.method = item.method
  this.hook = item.hook
}

Resource.create = function (item, callback) {
  return (new Resource(item)).save(callback)
}

Resource.prototype.destroy = function (callback) {
  helper.deleteAction(this.id, function (err) {
    if (err) callback.call(this, err)
    else callback.call(this, null)
  })
}

Resource.find = function (query, callback) {
  var result = []
  helper.findAction(query, function (err, row) {
    console.log(row)
    if (err) callback.call(this, 'err')
    else if (row == '') callback.call(this, 'No Row Finded!')
    else {
      row.forEach(function (action) {
        result.push(new Resource(action))
      })
      callback.call(this, null, result)
    }
  })
}

Resource.findOne = function (query, callback) {
  helper.findAction(query, function (err, row) {
    if (err) callback.call(this, err)
    else if (row == '') callback.call(this, 'No Row Finded!')
    else callback.call(this, null, new Resource(row[row.length - 1]))
  })
}

Resource.prototype.save = function (callback) {
  var self = this
  var schema = {
    app: this.app,
    location: this.location,
    topic: this.topic,
    groupname: this.groupname,
    method: this.method,
    hook: this.hook
  }
  helper.insertAction(schema,	function (err) {
    if (err) callback.call(this, err)
    else Resource.findOne({app: self.app}, callback)
  })
}

Resource.update = function (query, value, callback) {
  helper.updateAction(query, value, function (err) {
    if (err) callback.call(this, err)
    else callback.call(this, null)
  })
}

module.exports = Resource
