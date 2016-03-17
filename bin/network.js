#!/usr/bin/env node

var mqtt = require('mqtt')
var spawn = require('child_process').spawn
var request = require('superagent')

function getArp () {
  request.get('http://localhost:' + process.env.NETBEAST_PORT + '/api/resources')
  .end(function (err, res) {
    if (err) console.error(err)

    // Get all devices on the database
    var devices = res.body || []
    var arp_str = ''

    // Get all devices on the network
    var arp = spawn('arp', ['-a'])
    arp.stdout.setEncoding('utf8')
    arp.stdout.on('data', function (data) {
      arp_str = data
    })

    arp.on('close', function () {
      var arp_table = parse_arp_table(arp_str)
      var client = mqtt.connect('ws://localhost' + ':' + process.env.NETBEAST_PORT)
      client.publish('netbeast/network', JSON.stringify(joinTables(arp_table, devices)))
      client.end()
    })
  })
}

function parse_arp_table (arpt) {
  var arp_table = []

  arpt = arpt.split('\n')

  for (var aux in arpt) {
    var arp_obj = {}
    var entry = arpt[aux]

    // Get the position where IP starts
    var ip_start = entry.indexOf('(') + 1
    var ip_end = entry.indexOf(')')

    // Get the IP
    var ip = entry.slice(ip_start, ip_end)

    if (ip) arp_obj['ip'] = ip

    // Get the iface
    var iface_start = entry.indexOf('on') + 3
    var iface_end = entry[entry.length]
    var iface = entry.slice(iface_start, iface_end)

    if (iface) arp_obj['iface'] = iface

    // Get the position where MAC starts
    var mac_start = entry.indexOf(':') - 2
    var mac_end = mac_start + 17
    var mac = entry.slice(mac_start, mac_end)

    if (mac && mac!=='ff:ff:ff:ff:ff:ff') {
      arp_obj['mac'] = mac
      arp_table.push(arp_obj)
    }
  }
  return arp_table
}

function joinTables (arp_table, devices_table) {
  var result = arp_table
  devices_table.forEach(function (device) {
    result.forEach(function (entry, index) {
      if (device.mac_or_ip === entry.ip || device.mac_or_ip === entry.mac || device.id === entry.id) {
        result.splice(index)
        result.push(device)
      }
    })
  })
  return result
}

setInterval(function () {
  getArp()
}, 1000)
