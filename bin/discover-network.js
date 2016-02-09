#!/usr/bin/env node

var mqtt = require('mqtt')
var spawn = require('child_process').spawn


function getArp () {

	var arp = spawn('arp', ['-a']) 
	arp.stdout.setEncoding('utf8')
	arp.stdout.on('data', function(data) {
	arp_str = data;
	})

	arp.on('close', function(x) {

		devices = parse_arp_table(arp_str)
        var client = mqtt.connect('ws://localhost' + ':' + process.env.NETBEAST_PORT)
        client.publish('netbeast/network', JSON.stringify(devices))
        client.end()
	})
}

function parse_arp_table(arpt) {

	var arp_arr = []

	//Split array
	arpt = arpt.split('\n'); 

	var aux
	for (aux in arpt) {
		var arp_obj = {}
		var entry = arpt[aux];


        // Get the position where IP starts
        var ip_start = entry.indexOf('(') + 1
        var ip_end = entry.indexOf(')')

        //Get the IP
        var ip = entry.slice(ip_start, ip_end);
 
        if (ip) arp_obj['ip']= ip

        //Get the interface
        var interface_start = entry.indexOf('on') + 3
        var interface_end = entry[entry.length]
        var interface = entry.slice(interface_start, interface_end)
        
        if (interface) arp_obj['interface'] = interface

        //Get the position where MAC starts
        var mac_start = entry.indexOf(':') -2
        var mac_end = mac_start + 17
        var mac = entry.slice(mac_start, mac_end)

        if (mac) {
        	arp_obj['mac'] = mac
        	arp_arr.push(arp_obj)
        }
    }
    return arp_arr;
}

setInterval(function(){
    getArp()
}, 15000);


  
  
