#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

// Netbeast app tool suite
// By jesusdario, NetBeast CTO
// jesusdario.github.io
// jesus@netbeast.co
//=====================

var App = require('./App');
var program = require('commander');
var os = require("os");
var exec = require('child_process').exec;
var ifaces = os.networkInterfaces();

program
.version('1.1.1')
.command('rm <dir> [otherDirs...]')
.alias('uninstall').alias('remove')
.action(function (dir, otherDirs) {
	new App(dir).rm();
	if (otherDirs) {
		otherDirs.forEach(function (oDir) {
			console.log('rmdir %s', oDir);
			new App(oDir).rm();
		});
	}
});

program
.command('new <dir>')
.alias('create')
.action(function (dir) {
	new App(dir).new();
});

program
.command('pkg <app>')
.alias('package')
.option('-o, --to <path>', 'Output file name')
.action(function (app, options) {
	new App(app).pkg(options);
});

program
.command('unpkg <file>')
.alias('unpackage')
.option('-o, --to <path>', 'Output dir name')
.action(function (file, options) {
	new App(file).unpkg(options);
});

// ========================================================
// Edit
// Addons by Jon Senra,
// https://es.linkedin.com/pub/jon-senra-dearle/95/418/3bb
// jon@netbeast.co
// ========================================================

program
.command('scan')
.description('Find available xways in range and shows their IP')
.alias('discover')
.action(function () {
	// check if user has nmap
	exec('which nmap', function (error, stdout, stderr) {
		if (error !== null) {
      		console.error('exec error: ' + error);
   		}
   		// User does not have nmap
		if (stdout == "") {
			console.log("You need to install nmap in order to use xway scan");
		} else {
			// User has nmap
			Object.keys(ifaces).forEach(function (ifname) {
  				var alias = 0;

  				// Get host ip address
		  		ifaces[ifname].forEach(function (iface) {
			    	if ('IPv4' !== iface.family || iface.internal !== false) {
			      		// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
			      		return;
			    	}

			    	if (alias >= 1) {
			      		// this single interface has multiple ipv4 addresses
			      		console.log("Interface " + ifname + ':' + alias, iface.address);
			      		// Set ip with mask
			      		var ipWithMask = iface.address + "/24";
			      		// Execute nmap
		  				var nmap  = exec('nmap -p 22 --open -sV '+ipWithMask, 
		  					function (error, stdout, stderr) {
		    					console.log('stdout: ' + stdout);
		    					if (error !== null) {
		      						console.log('exec error: ' + error);
		   						}
		   				});
			    	} else {
			      		// this interface has only one ipv4 adress
			      		console.log("Interface " + ifname, iface.address);
			      		// Set ip with mask
			      		var ipWithMask = iface.address + "/24";
			      		// Execute nmap
		  				exec('nmap -p 22 --open -sV ' + ipWithMask, 
		  					function (error, stdout, stderr) {
		    					console.log('stdout: ' + stdout);
		    					if (error !== null) {
		      						console.log('exec error: ' + error);
		   						}
		   				});
		   			}
		   		});
   			});
		}
	});
});

program.parse(process.argv);
