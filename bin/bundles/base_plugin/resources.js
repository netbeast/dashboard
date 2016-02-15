/*
  We use this file to discover the devices.
  Once we find a device, we shuold:
    1. Register the device in the database, by following the given structure
    2. If the device is not available anymore, we should delete it from the database
*/

var request = require('request')

const API = process.env.NETBEAST + '/api/resources'

module.exports = function (callback) {

  // First we ask the database for all the devices of the same brand that are stored
  // We stored the hooks of this devices in the 'objects' array
  var objects = []

  // Request to the database
  request.get(API + '?app=NAME_PLUGIN',
  function (err, resp, body) {
    if (err) return callback(err)
    if (!body) return callback()

    body = JSON.parse(body)

    // Store the found devices in 'objects' array
    if (body.data.length > 0) {
      body.data.forEach(function (device) {
        if (objects.indexOf(device.hook) < 0) objects.push(device.hook)
      })
    }
  })



  // Implement the device discovery method

  // When we find a device
  //  1. Look if its already exists on the database.
  var indx = objects.indexOf('/HOOK/id') // hook == /Namebrand/id. Example. /hueLights, /Sonos
  // We will use the id to access to the device and modify it.
  // Any value to refer this device (MacAddress, for example) can work as id

  //  2. If the hook is in 'objects' array, delete it from the array
  if (indx >= 0) {
    objects.splice(indx, 1)

  // 3. If this device is not registered on the database, you should register it
  } else {
    //  Use this block to register the found device on the netbeast database
    //  in order to using it later
    request.post({url: API,
    json: {
      app: 'NAME_PLUGIN',          // Name of the device brand
      location: 'none',
      topic: 'TOPIC',      // lights, bridge, switch, temperature, sounds, etc
      groupname: 'none',
      hook: '/HOOK/id'  // HOOK == /Namebrand  Example. /hueLights, /Sonos
      // We will use the id to access to the device and modify it.
      // Any value to refer this device (MacAddress, for example) can work as id
    }},
    function (err, resp, body) {
      if (err) return callback(err)
      callback
    })
  }

  // If there exists 'hooks' stored on the 'objects' array, it means that
  // this devices are stored on the databases but are not reachable. We should
  // delete this devices from the database using the code given.
  if (objects.length > 0) {
    objects.forEach(function (hooks) {
      //  Use this block to delete a device from the netbeast database
      request.del(API + '?hook=' + hooks,
      function (err, resp, body) {
        if (err) callback(err)
      })
    })
  }

  /*
  This function is called from route.js, so
  if you need to pass any information to this file you can do it
  by using the callback ( callback(error, devices) , for example)
  */
  return callback(null)
}
