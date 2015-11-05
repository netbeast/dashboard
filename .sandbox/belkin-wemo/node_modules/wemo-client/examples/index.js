var Wemo = require('../index');
var wemo = new Wemo();

function foundDevice(deviceInfo) {
  console.log('Wemo Device Found: %s (%s)',
    deviceInfo.friendlyName, deviceInfo.deviceType);

  // Get the client for the found device
  var client = wemo.client(deviceInfo);

  // Handle binaryState events
  client.on('binaryState', function(value) {
    var states = {
      0: 'off',
      1: 'on',
      8: 'standby'
    };
    console.log('Binary State of %s is %s', this.device.friendlyName, states[value]);
  });

};

// Inital discovery
wemo.discover(foundDevice);

// Repeat discovery as some devices may appear late
setInterval(function() {
  wemo.discover(foundDevice);
}, 15000);
