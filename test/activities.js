#!/usr/bin/env node

var chai = require('chai')
, should = chai.should()
, expect = chai.expect

var request = require('request')
, config = require('../config')
, path = require('path')
, fs = require('fs')

var s = 1000 // seconds

// Test styling
// http://chaijs.com/guide/styles/

// tutorial
// http://code.tutsplus.com/tutorials/testing-in-nodejs--net-35018

describe('Activities', function () {
	it('should show activities', function(done) {
		expect(true).to.equal(true)
		done()
	})
})