var Wemo = require('../index');
var wemo = new Wemo();

function foundDevice(device) {
  if (device.deviceType === Wemo.DEVICE_TYPE.Insight) {
    console.log('Wemo Insight Switch found: %s', device.friendlyName);

    var client = this.client(device);
    client.on('insightParams', function(state, power) {
      console.log('%s’s power consumption: %s W',
        this.device.friendlyName,
        Math.round(power / 1000)
      );
    });
  }
}

wemo.discover(foundDevice);
