#!/usr/bin/env node

// var dns = require('dns')

var configPort = process.env.PORT
/*
function reverseLookup (ip) {
  dns.reverse(ip, function (err, domains) {
    if (err != null)	throw err
    domains.forEach(function (domain) {
      dns.lookup(domain, function (err, address, family) {
        if (err != null)	throw err
        console.log(domain, '[', address, ']')
        console.log('reverse:', ip === address)
      })
    })
  })
}

reverseLookup('localhost:' + configPort)
*/
