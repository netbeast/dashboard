#!/usr/bin/env node
/* global describe, it */
var chai = require('chai')
var should = chai.should()

var request = require('request')
var fs = require('fs-extra')
var path = require('path')

var App = require('src/models/app')
var config = require('config')


// Test styling
// http://chaijs.com/guide/styles/

// tutorial
// http://code.tutsplus.com/tutorials/testing-in-nodejs--net-35018

describe.skip('Proxy', function () {
  it('it should perform all requests methods correctly', function (done) {
  })

  it('it should be able to connect via websockets', function (done) {
  })
})
