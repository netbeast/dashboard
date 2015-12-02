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
  + 'hook TEXT NOT NULL)',
  callback)

}

helper.insertAction = function(query, callback) {
  var statement = db.prepare ("INSERT INTO actions ("
  + "'app', 'location', 'topic', 'groupname', 'hook') "
  + "VALUES (?,?,?,?,?)")
  statement.run(query.app, query.location, query.topic, query.groupname, query.hook,
    callback)
    statement.finalize()
  }

  helper.deleteAction = function(id, callback) {
    db.run("DELETE FROM actions WHERE id = '"
    + id + "'", callback)
  }

  helper.findAction = function(query, callback) {
    if (Object.keys(query).length < 1) {
      // Devuelve los diferentes Hooks que identifican al objeto
      db.all('SELECT DISTINCT hook FROM actions', callback)
    } else {
      var sql_statement = 'SELECT * FROM actions WHERE '
      for (var field in query) {
        sql_statement += field + "='" + query[field] + "' AND "
      }
      var aux = sql_statement.lastIndexOf('AND')
      sql_statement = sql_statement.substring(0, aux)
      console.log('[sql helper] %s', sql_statement)
      db.all(sql_statement, callback)
    }
  }


  helper.updateAction = function(query, value, callback) {
    var key = Object.keys(query)[0]
    var newvalue = Object.keys(value)[0]
    db.run("UPDATE actions SET " +  newvalue + "= '" + value[newvalue]
    + "' WHERE " + key + "= '" + query[key] + "'", callback)
  }

  module.exports = helper
