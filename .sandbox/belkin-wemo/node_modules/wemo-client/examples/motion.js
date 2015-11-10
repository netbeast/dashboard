var Wemo = require('../index');
var wemo = new Wemo();

function foundDevice(device) {
  if (device.deviceType === Wemo.DEVICE_TYPE.Motion) {
    console.log('Wemo Motion found: %s', device.friendlyName);

    var client = this.client(device);
    client.on('binaryState', function(value) {
      if (value === '1') {
        console.log('Wemo Motion "%s" detected motion', this.device.friendlyName);
      }
    });
  }
}

wemo.discover(foundDevice);
