var helper = require('../helpers/scene')
var ApiError = require('../util/api-error')

helper.createTable(function (err, data) {
  if (err) throw err
})

function Scene (item) {
  this.id = item.id
  this.sceneid = item.sceneid
  this.location = item.location
  this.state = item.state
}

Scene.create = function (item, done) {
  return (new Scene(item)).save(done)
}

Scene.prototype.destroy = function (done) {
  helper.deleteDevice(this, function (err) {
    if (err) return done(err)
    return done()
  })
}

Scene.find = function (query, done) {
  var result = []
  helper.findDevice(query, function (err, row) {
    if (err) return done(err)
    if (!row.length) return done(new ApiError(404, 'Resource not found DB'))

    row.forEach(function (action) {
      result.push(new Scene(action))
    })
    return done(null, result)
  })
}

Scene.findOne = function (query, done) {
  helper.findDevice({id: query.id, sceneid: query.sceneid}, function (err, row) {
    if (err) done(err)
    else if (!row.length) done(new ApiError(404, 'Resource not found DB'))
    else done(null, new Scene(row[row.length - 1]))
  })
}

Scene.prototype.save = function (done) {
  var self = this
  var schema = {
    id: this.id,
    sceneid: this.sceneid,
    location: this.location,
    state: this.state
  }
  helper.insertDevice(schema,	function (err) {
    if (err) return done(err)

    return Scene.findOne({id: self.id, sceneid: self.sceneid}, done)
  })
}

Scene.update = function (query, value, done) {
  helper.updateDevice(query, value, function (err) {
    if (err) return done(err)

    return done()
  })
}

module.exports = Scene
