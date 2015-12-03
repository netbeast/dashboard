var sqlite3 = require('sqlite3').verbose()

var config = require('../../config')

var db = new sqlite3.Database(config.DATABASE_URI)

var helper = {}

helper.createTable = function (done) {
  db.run('CREATE TABLE IF NOT EXISTS actions(' +
  'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
  'app TEXT NOT NULL, ' +
  'location TEXT NOT NULL, ' +
  'topic TEXT NOT NULL, ' +
  'groupname TEXT NOT NULL, ' +
  'hook TEXT NOT NULL)',
  done)
}

helper.insertAction = function (query, done) {
  var statement = db.prepare('INSERT INTO actions (' +
  "'app', 'location', 'topic', 'groupname', 'hook') " +
  'VALUES (?,?,?,?,?)')
  statement
  .run(query.app, query.location, query.topic, query.groupname, query.hook, done)
  statement.finalize()
}

helper.deleteAction = function (id, done) {
  db.run("DELETE FROM actions WHERE id = '" + id + "'", done)
}

helper.findAction = function (query, done) {
  if (Object.keys(query).length < 1) {
    // Devuelve los diferentes Hooks que identifican al objeto
    db.all('SELECT DISTINCT hook FROM actions', done)
  } else {
    var sql_statement = 'SELECT * FROM actions WHERE '
    for (var field in query) {
      sql_statement += field + "='" + query[field] + "' AND "
    }
    var aux = sql_statement.lastIndexOf('AND')
    sql_statement = sql_statement.substring(0, aux)
    db.all(sql_statement, done)
  }
}

helper.updateAction = function (query, value, done) {
  var key = Object.keys(query)[0]
  var newvalue = Object.keys(value)[0]
  db.run('UPDATE actions SET ' + newvalue + "= '" + value[newvalue] +
  "' WHERE " + key + "= '" + query[key] + "'", done)
}

module.exports = helper
