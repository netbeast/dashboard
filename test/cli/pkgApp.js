/* global describe, before, it*/

var should = require('chai').should()

var exec = require('child_process').exec
var fs = require('fs')

describe('Command Line Interface: package', function () {
  before(function (done) {
    exec('beast package testApp', function (err, stdout, stderr) {
      should.not.exist(err)
      done()
    })
  })
  it('should create a packaged app from testApp called app.tar.gz', function (done) {
    var pathToPkg = process.cwd()
    fs.access(pathToPkg + '/app.tar.gz', fs.F_OK, function (err) {
      should.not.exist(err)
      exec('rm -rf app.tar.gz', function (err, stdout, stderr) {
        should.not.exist(err)
        done()
      })
    })
  })
  // package app with option -o
  before(function (done) {
    exec('beast package testApp -o testAppO.tar.gz', function (err, stdout, stderr) {
      should.not.exist(err)
      done()
    })
  })
  it('should create a packaged app from testApp called testApp.tar.gz (option -o)', function (done) {
    var pathToPkg = process.cwd()
    fs.access(pathToPkg + '/testAppO.tar.gz', fs.F_OK, function (err) {
      should.not.exist(err)
      done()
    })
  })
  // package app with option --to
  before(function (done) {
    exec('beast package testApp -o testAppTO.tar.gz', function (err, stdout, stderr) {
      should.not.exist(err)
      done()
    })
  })
  it('should create a packaged app from testApp called testApp.tar.gz (option --to)', function (done) {
    var pathToPkg = process.cwd()
    fs.access(pathToPkg + '/testAppTO.tar.gz', fs.F_OK, function (err) {
      should.not.exist(err)
      exec('rm -rf testApp', function (err, stdout, stderr) {
        should.not.exist(err)
        done()
      })
    })
  })
  // unpkg option -o
  before(function (done) {
    exec('beast unpkg testAppO.tar.gz -o testAppO', function (err, stdout, stderr) {
      should.not.exist(err)
      done()
    })
  })
  it('should create a testApp folder result of the uncompression of testApp.tar.gz (option -o)', function (done) {
    var pathToPkg = process.cwd()
    fs.access(pathToPkg + '/testAppO', fs.F_OK, function (err) {
      should.not.exist(err)
      exec('rm -rf testAppO', function (err, stdout, stderr) {
        should.not.exist(err)
        done()
      })
    })
  })
  // unpkg option --to
  before(function (done) {
    exec('beast unpkg testAppTO.tar.gz --to testAppTO', function (err, stdout, stderr) {
      should.not.exist(err)
      done()
    })
  })
  it('should create a testApp folder result of the uncompression of testApp.tar.gz (option --to)', function (done) {
    var pathToPkg = process.cwd()
    fs.access(pathToPkg + '/testAppTO', fs.F_OK, function (err) {
      should.not.exist(err)
      exec('rm -rf testAppTO testAppO testAppTO.tar.gz testAppO.tar.gz', function (err, stdout, stderr) {
        should.not.exist(err)
        done()
      })
    })
  })
})
