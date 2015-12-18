var sqlite3 = require('sqlite3').verbose()

var config = require('../../config')

var db = new sqlite3.Database(config.DATABASE_URI)

var helper = {}

helper.createTable = function (callback) {
  db.run('CREATE TABLE IF NOT EXISTS scenes(' +
  'id INTEGER NOT NULL, ' +
  'sceneid TEXT NOT NULL, ' +
  'location TEXT NOT NULL, ' +
  'power BOOLEAN NOT NULL, ' +
  'brightness INTEGER, ' +
  'hue INTEGER, ' +
  'saturation INTEGER, ' +
  'PRIMARY KEY(id, sceneid))',
  callback)
}

helper.insertDevice = function (query, callback) {
  var statement = db.prepare('INSERT INTO scenes (' +
  "'id', 'sceneid', 'location', 'power', 'brightness', 'hue', 'saturation') " +
  'VALUES (?,?,?,?,?,?,?)')

  statement.run(
    query.id, query.sceneid, query.location, query.power,
    query.brightness, query.hue, query.saturation, callback
  )
  statement.finalize()
}

helper.deleteDevice = function (device, callback) {
  db.run("DELETE FROM scenes WHERE id = '" +
  device.id + "' AND sceneid = '" +
  device.sceneid + "'", callback)
}

helper.findDevice = function (query, callback) {
  switch(Object.keys(query).length) {
    case 0:
    db.all('SELECT DISTINCT sceneid FROM scenes', callback)
    break
    case 1:
    db.all('SELECT * FROM scenes WHERE ' +
    Object.keys(query)[0] + " = '" +
    query[Object.keys(query)[0]] + "'", callback)
    break
    case 2:
    db.all('SELECT * FROM scenes WHERE ' +
    Object.keys(query)[0] + " = '" +
    query[Object.keys(query)[0]] + "' AND " +
    Object.keys(query)[1] + " = '" +
    query[Object.keys(query)[1]] + "'", callback)
    break
    case 3:
      db.all('SELECT * FROM scenes WHERE ' +
    Object.keys(query)[0] + " = '" +
    query[Object.keys(query)[0]] + "' AND " +
    Object.keys(query)[1] + " = '" +
    query[Object.keys(query)[1]] + "' AND " +
    Object.keys(query)[2] + " = '" +
    query[Object.keys(query)[2]] + "'", callback)
    break

    case 4:
    db.all('SELECT * FROM scenes WHERE ' +
     Object.keys(query)[0] + " = '" +
     query[Object.keys(query)[0]] + "' AND " +
     Object.keys(query)[1] + " = '" +
     query[Object.keys(query)[1]] + "' AND " +
     Object.keys(query)[2] + " = '" +
     query[Object.keys(query)[2]] + "' AND " +
     Object.keys(query)[3] + " = '" +
     query[Object.keys(query)[3]] + "'", callback)
    break

    case 5:
    db.all("SELECT * FROM scenes WHERE "
    + Object.keys(query)[0] + " = '"
    + query[Object.keys(query)[0]] + "' AND "
    + Object.keys(query)[1] + " = '"
    + query[Object.keys(query)[1]] + "' AND "
    + Object.keys(query)[2] + " = '"
    + query[Object.keys(query)[2]] + "' AND "
    + Object.keys(query)[3] + " = '"
    + query[Object.keys(query)[3]] + "' AND "
    + Object.keys(query)[4] + " = '"
    + query[Object.keys(query)[4]] + "'", callback)
    break

    case 6:
    db.all("SELECT * FROM scenes WHERE "
    + Object.keys(query)[0] + " = '"
    + query[Object.keys(query)[0]] + "' AND "
    + Object.keys(query)[1] + " = '"
    + query[Object.keys(query)[1]] + "' AND "
    + Object.keys(query)[2] + " = '"
    + query[Object.keys(query)[2]] + "' AND "
    + Object.keys(query)[3] + " = '"
    + query[Object.keys(query)[3]] + "' AND "
    + Object.keys(query)[4] + " = '"
    + query[Object.keys(query)[4]] + "' AND "
    + Object.keys(query)[5] + " = '"
    + query[Object.keys(query)[5]] + "'", callback)
    break

    case 7:
    db.all("SELECT * FROM scenes WHERE "
    + Object.keys(query)[0] + " = '"
    + query[Object.keys(query)[0]] + "' AND "
    + Object.keys(query)[1] + " = '"
    + query[Object.keys(query)[1]] + "' AND "
    + Object.keys(query)[2] + " = '"
    + query[Object.keys(query)[2]] + "' AND "
    + Object.keys(query)[3] + " = '"
    + query[Object.keys(query)[3]] + "' AND "
    + Object.keys(query)[4] + " = '"
    + query[Object.keys(query)[4]] + "' AND "
    + Object.keys(query)[5] + " = '"
    + query[Object.keys(query)[5]] + "' AND "
    + Object.keys(query)[6] + " = '"
    + query[Object.keys(query)[6]] + "'", callback)
    break

    default:
    console.log("wrong query, too long")
    break
  }
}

helper.updateDevice = function (query, value, callback) {
  var key = Object.keys(query)[0]
  var newvalue = Object.keys(value)[0]
  db.run("UPDATE scenes SET " +  newvalue + "= '" + value[newvalue]
  + "' WHERE " + key + "= '" + query[key] + "'", callback)
}

module.exports = helper
