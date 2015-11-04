var helper = require('../lib/scene')

helper.createTable(function (err, data) {
  if (err) throw err
})

function Scene (item) {
  this.id = item.id
  this.sceneid = item.sceneid
  this.location = item.location
  this.status = item.status
  this.bri = item.bri
  this.hue = item.hue
  this.sat = item.sat
}

Scene.create = function (item, callback) {
  return (new Scene(item)).save(callback)
}

Scene.prototype.destroy = function (callback) {
  helper.deleteDevice(this, function (err) {
    if (err) callback.call(this, err)
    else callback.call(this, null)
  })
}

Scene.find = function (query, callback) {
  var result = []
  helper.findDevice(query, function (err, row) {
    if (err) callback.call(this, err)
    else if (row == '') callback.call(this, 'No Row Finded!')
    else {
      row.forEach(function (action) {
        result.push(new Scene(action))
      })
      callback.call(this, null, result)
    }
  })
}

Scene.findOne = function (query, callback) {
  helper.findDevice(query, function (err, row) {
    if (err) callback.call(this, err)
    else if (row == '') callback.call(this, 'No Row Finded!')
    else callback.call(this, null, new Scene(row[row.length - 1]))
  })
}

Scene.prototype.save = function (callback) {
  var self = this
  var schema = {
    id: this.id,
    sceneid: this.sceneid,
    location: this.location,
    status: this.status,
    bri: this.bri,
    hue: this.hue,
    sat: this.sat
  }
  helper.insertDevice(schema,	function (err) {
    if (err) callback.call(this, err)
    else Scene.findOne({id: self.id}, callback)
  })
}

Scene.update = function (query, value, callback) {
  helper.updateDevice(query, value, function (err) {
    if (err) callback.call(this, err)
    else callback.call(this, null)
  })
}

module.exports = Scene
