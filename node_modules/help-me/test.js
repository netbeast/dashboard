
var test        = require('tape')
  , concat      = require('concat-stream')
  , fs          = require('fs')
  , helpMe      = require('./')

test('show the doc/help.txt from the require.main folder if no options are passed', function(t) {
  t.plan(2)

  helpMe()
    .createHelpStream()
    .pipe(concat(function(data) {
      fs.readFile('./doc/help.txt', function(err, expected) {
        t.error(err)
        t.equal(data.toString(), expected.toString())
      })
    }))
})

test('show a generic help.txt from a folder to a stream', function(t) {
  t.plan(2)

  helpMe({
      dir: 'fixture/basic'
  }).createHelpStream()
    .pipe(concat(function(data) {
      fs.readFile('fixture/basic/help.txt', function(err, expected) {
        t.error(err)
        t.equal(data.toString(), expected.toString())
      })
    }))
})

test('custom help command with an array', function(t) {
  t.plan(2)

  helpMe({
      dir: 'fixture/basic'
  }).createHelpStream(['hello'])
    .pipe(concat(function(data) {
      fs.readFile('fixture/basic/hello.txt', function(err, expected) {
        t.error(err)
        t.equal(data.toString(), expected.toString())
      })
    }))
})

test('custom help command without an ext', function(t) {
  t.plan(2)

  helpMe({
      dir: 'fixture/basic'
    , ext: ''
  }).createHelpStream(['hello'])
    .pipe(concat(function(data) {
      fs.readFile('fixture/basic/hello', function(err, expected) {
        t.error(err)
        t.equal(data.toString(), expected.toString())
      })
    }))
})

test('custom help command with a string', function(t) {
  t.plan(2)

  helpMe({
      dir: 'fixture/basic'
  }).createHelpStream('hello')
    .pipe(concat(function(data) {
      fs.readFile('fixture/basic/hello.txt', function(err, expected) {
        t.error(err)
        t.equal(data.toString(), expected.toString())
      })
    }))
})

test('missing help file', function(t) {
  t.plan(1)

  helpMe({
      dir: 'fixture/basic'
  }).createHelpStream('abcde')
    .on('error', function(err) {
      t.equal(err.code, 'ENOENT')
    })
    .resume()
})
