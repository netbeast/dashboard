// var chalk = require('chalk')
var spawn = require('child_process').spawn

var Resource = require('../models/resource')
var broker = require('../helpers/broker')

setInterval(function () {
  getArp()
}, 6000)

var cachedResult

function getArp () {
  Resource.find({}, function (err, devices) {
    if (err && err.statusCode !== 404) return console.error(err)

      // Get all devices on the database
    var arp_str = ''

    // Get all devices on the network
    var arp = spawn('arp', ['-a'])
    arp.stdout.setEncoding('utf8')
    arp.stdout.on('data', function (data) {
      arp_str = data
    })

    arp.on('error', function (err) { 
      console.trace(err)
      broker.client.publish('netbeast/network', JSON.stringify(devices))
    })

    arp.on('close', function () {
      var arp_table = parse_arp_table(arp_str)
      var result = joinTables(arp_table, devices)
      result = JSON.stringify(result)

      if (cachedResult !== result) {
        console.log('[scanner] devices list changed')
        cachedResult = result // override
        broker.client.publish('netbeast/network', result)
      }
    })
  })
}

function joinTables (arp_table, devices_table) {
  var result = devices_table || []

  arp_table.forEach(function (device) {
    var found = false
    result.forEach(function (entry, index) {
      if (device.ip === entry.ip || device.mac === entry.mac) {
        delete device.save
        delete device.destroy
        result[index] = _merge(entry, device)
        found = true
      }
    })
    if (!found) result.push(device)
  })

  return result
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

    if (mac && mac !== 'ff:ff:ff:ff:ff:ff') {
      arp_obj['mac'] = mac
      arp_table.push(arp_obj)
    }
  }
  return arp_table
}

function _merge (obj1, obj2) {
  var obj3 = {}
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname] }
    for (var attr in obj2) { obj3[attr] = obj2[attr] }
      return obj3
  }
