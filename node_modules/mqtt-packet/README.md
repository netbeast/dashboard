mqtt-packet&nbsp;&nbsp;&nbsp;[![Build Status](https://travis-ci.org/mqttjs/mqtt-packet.png)](https://travis-ci.org/mqttjs/mqtt-packet)
===========

Encode and Decode MQTT 3.1.1 packets the node way.

  * <a href="#install">Install</a>
  * <a href="#examples">Examples</a>
  * <a href="#packets">Packets</a>
  * <a href="#api">API</a>
  * <a href="#contributing">Contributing</a>
  * <a href="#license">Licence &amp; copyright</a>

This library works with node v4.x, v0.12.x, v0.10.x and node v0.8.x and all iojs releases, but it requires at
least NPM 1.4. To upgrade NPM on node v0.8, run `npm install
npm@1.4.28 -g`.

Install
------------

```bash
npm install mqtt-packet --save
```

Examples
--------

### Generating

```js
var mqtt    = require('mqtt-packet')
  , object  = {
        cmd: 'publish'
      , retain: false
      , qos: 0
      , dup: false
      , length: 10
      , topic: 'test'
      , payload: 'test' // can also be a Buffer
    }

console.log(mqtt.generate(object))
// prints
// <Buffer 30 0a 00 04 74 65 73 74 74 65 73 74>
//
// the same as
//
// new Buffer([
//   48, 10, // Header
//   0, 4, // Topic length
//   116, 101, 115, 116, // Topic (test)
//   116, 101, 115, 116 // Payload (test)
// ])
```

### Parsing

```js
var mqtt      = require('mqtt-packet')
  , parser    = mqtt.parser()

// synchronously emits all the parsed packets
parser.on('packet', function(packet) {
  console.log(packet)
  // prints:
  //
  // {
  //     cmd: 'publish'
  //   , retain: false
  //   , qos: 0
  //   , dup: false
  //   , length: 10
  //   , topic: 'test'
  //   , payload: <Buffer 74 65 73 74>
  // }
})

parser.parse(new Buffer([
  48, 10, // Header
  0, 4, // Topic length
  116, 101, 115, 116, // Topic (test)
  116, 101, 115, 116 // Payload (test)
])
// returns the number of bytes left in the parser
```

API
---

  * <a href="#generate"><code>mqtt#<b>generate()</b></code></a>
  * <a href="#parser"><code>mqtt#<b>parser()</b></code></a>

<a name="generate">
### mqtt.generate(object)

Generates a `Buffer` containing an MQTT packet.
The object must be one of the ones specified by the [packets](#packets)
section. Throws an `Error` if a packet cannot be generated.

<a name="parser">
### mqtt.parser()

Returns a new `Parser` object. `Parser` inherits from `EventEmitter` and
will emit:

  * `packet`, when a new packet is parsed, according to
    [packets](#packets)
  * `error`, if an error happens

<a name="parse">
#### Parser.parse(buffer)

Parse a given `Buffer` and emits synchronously all the MQTT packets that
are included. Returns the number of bytes left to parse.

Packets
-------

This section describes the format of all packets emitted by the `Parser`
and that you can input to `generate`.

### Connect

```js
{
    cmd: 'connect'
  , protocolId: 'MQTT' // or 'MQIsdp' in MQTT 3.1.1
  , protocolVersion: 4 // or 3 in MQTT 3.1
  , clean: true // or false
  , clientId: 'my-device'
  , keepalive: 0 // seconds, 0 is the default, can be any positive number
  , username: 'matteo'
  , password: new Buffer('collina') // passwords are buffers
  , will: {
        topic: 'mydevice/status'
      , payload: new Buffer('dead') // payloads are buffers
    }
}
```

If `protocolVersion` is 3, `clientId` is mandatory and `generate` will throw if
missing.

If `password` or `will.payload` are passed as strings, they will
automatically be converted into a `Buffer`.

### Connack

```js
{
    cmd: 'connack'
  , returnCode: 0 // or whatever else you see fit
  , sessionPresent: false // or true.
}
```

The only mandatory argument is `returnCode`, as `generate` will throw if
missing.

### Subscribe

```js
{
    cmd: 'subscribe'
  , messageId: 42
  , subscriptions: [{
        topic: 'test'
      , qos: 0
    }]
}
```

All properties are mandatory.

### Suback

```js
{
    cmd: 'suback'
  , messageId: 42
  , granted: [0, 1, 2, 128]
}
```

All the granted qos __must__ be < 256, as they are encoded as UInt8.
All properties are mandatory.

### Unsubscribe

```js
{
    cmd: 'unsubscribe'
  , messageId: 42
  , unsubscriptions: [
        'test'
      , 'a/topic'
    ]
}
```

All properties are mandatory.

### Unsuback

```js
{
    cmd: 'unsuback'
  , messageId: 42
}
```

All properties are mandatory.

### Publish

```js
{
    cmd: 'publish'
  , messageId: 42
  , qos: 2
  , dup: false
  , topic: 'test'
  , payload: new Buffer('test')
  , retain: false
}
```

Only the `topic` and properties are mandatory
Both `topic` and `payload` can be `Buffer` objects instead of strings.
`messageId` is mandatory for `qos > 0`.

If `payload` is passed to `generate(packet)` as a string, it will be
automatically converted into a `Buffer`.

### Puback

```js
{
    cmd: 'puback'
  , messageId: 42
}
```

The only mandatory argument is `messageId`, as `generate` will throw if
missing.

### Pubrec

```js
{
    cmd: 'pubcomp'
  , messageId: 42
}
```

The only mandatory argument is `messageId`, as `generate` will throw if
missing.

### Pubrel

```js
{
    cmd: 'pubrel'
  , messageId: 42
}
```

The only mandatory argument is `messageId`, as `generate` will throw if
missing.

### Pubcomp

```js
{
    cmd: 'pubcomp'
  , messageId: 42
}
```

The only mandatory argument is `messageId`, as `generate` will throw if
missing.

### Pingreq

```js
{
  cmd: 'pingreq'
}
```

### Pingresp

```js
{
  cmd: 'pingresp'
}
```

### Disconnect

```js
{
  cmd: 'pingresp'
}
```

<a name="contributing"></a>
Contributing
------------

mqtt-packet is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [CONTRIBUTING.md](https://github.com/mqttjs/mqtt-packet/blob/master/CONTRIBUTING.md) file for more details.

### Contributors

mqtt-packet is only possible due to the excellent work of the following contributors:

<table><tbody>
<tr><th align="left">Matteo Collina</th><td><a href="https://github.com/mcollina">GitHub/mcollina</a></td><td><a href="http://twitter.com/matteocollina">Twitter/@matteocollina</a></td></tr>
<tr><th align="left">Adam Rudd</th><td><a href="https://github.com/adamvr">GitHub/adamvr</a></td><td><a href="http://twitter.com/adam_vr">Twitter/@adam_vr</a></td></tr>
</tbody></table>

License
-------

MIT
