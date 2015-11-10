var Wemo = require('../index');
var wemo = new Wemo();

function foundDevice(device) {
  if (device.deviceType === Wemo.DEVICE_TYPE.Maker) {
    console.log('Wemo Maker found: %s', device.friendlyName);

    var client = this.client(device);
    client.on('attributeList', function(name, value) {
      console.log('Wemo Maker "%s" changed %s to %s', this.device.friendlyName, name, value);
    });

    // Close the switch after 3 seconds
    setTimeout(function() {
      client.setBinaryState(1);
    }, 3 * 1000);
  }

}

wemo.discover(foundDevice);
