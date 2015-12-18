/* global describe, before, it*/

var should = require('chai').should()
var exec = require('child_process').exec

var output, install_output = ''

describe('Command Line Interface: scan dashboard and uploads app', function () {
  before(function (done) {
    this.timeout(4000)
    exec('beast scan', function (err, stdout, stderr) {
      should.not.exist(err)
      output = stdout
      done()
    })
  })
  it('should exists a dashboard alive (scan)', function (done) {
    this.timeout(4000)
    if (output.indexOf('alive') > -1) {
      done()
    }
  })
  before(function (done) {
    this.timeout(4000)
    exec('beast discover', function (err, stdout, stderr) {
      should.not.exist(err)
      output = stdout
      done()
    })
  })
  it('should exists a dashboard alive (discover)', function (done) {
    this.timeout(4000)
    if (output.indexOf('alive') > -1) {
      done()
    }
  })
/*  before(function (done) {
    this.timeout(25000)
    exec('beast new testApp; beast install testApp localhost', function (err, stdout, stderr) {
      should.not.exist(err)
      install_output = stdout
      console.log(install_output)
      done()
    })
  })
  it('should install testApp', function (done) {
     this.timeout(25000)
    if (install_output.indexOf('extraneous') > -1) {
      done()
    }
  }) */
})
