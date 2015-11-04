var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('resources')

var helper ={}

helper.createTable = function(callback) {
  db.run('CREATE TABLE IF NOT EXISTS actions('
  + 'id INTEGER PRIMARY KEY AUTOINCREMENT, '
  + 'app TEXT NOT NULL, '
  + 'location TEXT NOT NULL, '
  + 'topic TEXT NOT NULL, '
  + 'groupname TEXT NOT NULL, '
  + 'method TEXT NOT NULL, '
  + 'hook TEXT NOT NULL)',
  callback)

}

helper.insertAction = function(query, callback) {
  var statement = db.prepare ("INSERT INTO actions ("
  + "'app', 'location', 'topic', 'groupname', 'method', 'hook') "
  + "VALUES (?,?,?,?,?,?)")
  statement.run(query.app, query.location, query.topic, query.groupname, query.method, query.hook,
    callback)
    statement.finalize()
  }

  helper.deleteAction = function(id, callback) {
    db.run("DELETE FROM actions WHERE id = '"
    + id + "'", callback)
  }

  helper.findAction = function(query, callback) {
    switch(Object.keys(query).length) {
      case 0:
      // Devuelve los diferentes Hooks que identifican al objeto
      db.all("SELECT DISTINCT hook FROM actions", callback)
      break

      case 1:
      db.all("SELECT * FROM actions WHERE "
      + Object.keys(query)[0] + " = '"
      + query[Object.keys(query)[0]] + "'", callback)
      break

      case 2:
      db.all("SELECT * FROM actions WHERE "
      + Object.keys(query)[0] + " = '"
      + query[Object.keys(query)[0]] + "' AND "
      + Object.keys(query)[1] + " = '"
      + query[Object.keys(query)[1]] + "'", callback)
      break

      case 3:
      db.all("SELECT * FROM actions WHERE "
      + Object.keys(query)[0] + " = '"
      + query[Object.keys(query)[0]] + "' AND "
      + Object.keys(query)[1] + " = '"
      + query[Object.keys(query)[1]] + "' AND "
      + Object.keys(query)[2] + " = '"
      + query[Object.keys(query)[2]] + "'", callback)
      break

      case 4:
      db.all("SELECT * FROM actions WHERE "
      + Object.keys(query)[0] + " = '"
      + query[Object.keys(query)[0]] + "' AND "
      + Object.keys(query)[1] + " = '"
      + query[Object.keys(query)[1]] + "' AND "
      + Object.keys(query)[2] + " = '"
      + query[Object.keys(query)[2]] + "' AND "
      + Object.keys(query)[3] + " = '"
      + query[Object.keys(query)[3]] + "'", callback)
      break

      case 5:
      db.all("SELECT * FROM actions WHERE "
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
      db.all("SELECT * FROM actions WHERE "
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

      default:
      console.log("wrong query, too long")
      break
    }
  }

  helper.updateAction = function(query, value, callback) {
    var key = Object.keys(query)[0]
    var newvalue = Object.keys(value)[0]
    db.run("UPDATE actions SET " +  newvalue + "= '" + value[newvalue]
    + "' WHERE " + key + "= '" + query[key] + "'", callback)
  }

  module.exports = helper
