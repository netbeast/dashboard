
var test    = require('tape')
  , mqtt    = require('./')

function testParseGenerate(name, object, buffer, opts) {
  test(name + ' parse', function(t) {
    t.plan(2)

    var parser    = mqtt.parser(opts)
      , expected  = object
      , fixture   = buffer

    parser.on('packet', function(packet) {
      if (packet.cmd !== 'publish') {
        delete packet.topic
        delete packet.payload
      }
      t.deepEqual(packet, expected, 'expected packet')
    })

    t.equal(parser.parse(fixture), 0, 'remaining bytes')
  })

  test(name + ' generate', function(t) {
    t.equal(mqtt.generate(object).toString('hex'), buffer.toString('hex'))
    t.end()
  })

  test(name + ' mirror', function(t) {
    t.plan(2)

    var parser    = mqtt.parser(opts)
      , expected  = object
      , fixture   = mqtt.generate(object)

    parser.on('packet', function(packet) {
      if (packet.cmd !== 'publish') {
        delete packet.topic
        delete packet.payload
      }
      t.deepEqual(packet, expected, 'expected packet')
    })

    t.equal(parser.parse(fixture), 0, 'remaining bytes')
  })
}

function testParseError(expected, fixture) {
  test(expected, function(t) {
    t.plan(1)

    var parser = mqtt.parser()

    parser.on('error', function(err) {
      t.equal(err.message, expected, 'expected error message')
    })

    parser.parse(fixture)
  })
}

function testGenerateError(expected, fixture) {
  test(expected, function(t) {
    t.plan(1)

    try {
      mqtt.generate(fixture)
    } catch(err) {
      t.equal(expected, err.message)
    }
  })
}

function testParseGenerateDefaults(name, object, buffer, opts) {
  test(name + ' parse', function(t) {
    var parser    = mqtt.parser(opts)
      , expected  = object
      , fixture   = buffer

    t.plan(1 + Object.keys(expected).length)

    parser.on('packet', function(packet) {
      Object.keys(expected).forEach(function(key) {
        t.deepEqual(packet[key], expected[key], 'expected packet property ' + key)
      })
    })

    t.equal(parser.parse(fixture), 0, 'remaining bytes')
  })

  test(name + ' generate', function(t) {
    t.equal(mqtt.generate(object).toString('hex'), buffer.toString('hex'))
    t.end()
  })
}

testParseGenerate('minimal connect', {
    cmd: 'connect'
  , retain: false
  , qos: 0
  , dup: false
  , length: 18
  , protocolId: 'MQIsdp'
  , protocolVersion: 3
  , clean: false
  , keepalive: 30
  , clientId: 'test'
}, new Buffer([
  16, 18, // Header
  0, 6, // Protocol id length
  77, 81, 73, 115, 100, 112, // Protocol id
  3, // Protocol version
  0, // Connect flags
  0, 30, // Keepalive
  0, 4, //Client id length
  116, 101, 115, 116 // Client id
]))

testParseGenerate('no clientId with 3.1.1', {
    cmd: 'connect'
  , retain: false
  , qos: 0
  , dup: false
  , length: 12
  , protocolId: 'MQTT'
  , protocolVersion: 4
  , clean: true
  , keepalive: 30
  , clientId: ''
}, new Buffer([
  16, 12, // Header
  0, 4, // Protocol id length
  77, 81, 84, 84, // Protocol id
  4, // Protocol version
  2, // Connect flags
  0, 30, // Keepalive
  0, 0, //Client id length
]))

testParseGenerateDefaults('default connect', {
    cmd: 'connect'
  , clientId: 'test'
}, new Buffer([
  16, 16, 0, 4, 77, 81, 84,
  84, 4, 2, 0, 0,
  0, 4, 116, 101, 115, 116
]))


testParseGenerate('empty will payload', {
    cmd: 'connect'
  , retain: false
  , qos: 0
  , dup: false
  , length: 47
  , protocolId: 'MQIsdp'
  , protocolVersion: 3
  , will: {
        retain: true
      , qos: 2
      , topic: 'topic'
      , payload: new Buffer(0)
    }
  , clean: true
  , keepalive: 30
  , clientId: 'test'
  , username: 'username'
  , password: new Buffer('password')
}, new Buffer([
  16, 47, // Header
  0, 6, // Protocol id length
  77, 81, 73, 115, 100, 112, // Protocol id
  3, // Protocol version
  246, // Connect flags
  0, 30, // Keepalive
  0, 4, // Client id length
  116, 101, 115, 116, // Client id
  0, 5, // will topic length
  116, 111, 112, 105, 99, // will topic
  0, 0, // will payload length
  // will payload
  0, 8, // username length
  117, 115, 101, 114, 110, 97, 109, 101, // username
  0, 8, // password length
  112, 97, 115, 115, 119, 111, 114, 100 //password
]))

testParseGenerate('maximal connect', {
    cmd: 'connect'
  , retain: false
  , qos: 0
  , dup: false
  , length: 54
  , protocolId: 'MQIsdp'
  , protocolVersion: 3
  , will: {
        retain: true
      , qos: 2
      , topic: 'topic'
      , payload: new Buffer('payload')
    }
  , clean: true
  , keepalive: 30
  , clientId: 'test'
  , username: 'username'
  , password: new Buffer('password')
}, new Buffer([
  16, 54, // Header
  0, 6, // Protocol id length
  77, 81, 73, 115, 100, 112, // Protocol id
  3, // Protocol version
  246, // Connect flags
  0, 30, // Keepalive
  0, 4, // Client id length
  116, 101, 115, 116, // Client id
  0, 5, // will topic length
  116, 111, 112, 105, 99, // will topic
  0, 7, // will payload length
  112, 97, 121, 108, 111, 97, 100, // will payload
  0, 8, // username length
  117, 115, 101, 114, 110, 97, 109, 101, // username
  0, 8, // password length
  112, 97, 115, 115, 119, 111, 114, 100 //password
]))

test('connect all strings generate', function(t) {
  var message = {
          cmd: 'connect'
        , retain: false
        , qos: 0
        , dup: false
        , length: 54
        , protocolId: 'MQIsdp'
        , protocolVersion: 3
        , will: {
              retain: true
            , qos: 2
            , topic: 'topic'
            , payload: 'payload'
          }
        , clean: true
        , keepalive: 30
        , clientId: 'test'
        , username: 'username'
        , password: 'password'
      }
    , expected = new Buffer([
        16, 54, // Header
        0, 6, // Protocol id length
        77, 81, 73, 115, 100, 112, // Protocol id
        3, // Protocol version
        246, // Connect flags
        0, 30, // Keepalive
        0, 4, // Client id length
        116, 101, 115, 116, // Client id
        0, 5, // will topic length
        116, 111, 112, 105, 99, // will topic
        0, 7, // will payload length
        112, 97, 121, 108, 111, 97, 100, // will payload
        0, 8, // username length
        117, 115, 101, 114, 110, 97, 109, 101, // username
        0, 8, // password length
        112, 97, 115, 115, 119, 111, 114, 100 //password
      ])

  t.equal(mqtt.generate(message).toString('hex'), expected.toString('hex'))
  t.end()
})

testParseError('cannot parse protocol id', new Buffer([
  16, 4,
  0, 6,
  77, 81
]))

testParseGenerate('connack with return code 0', {
    cmd: 'connack'
  , retain: false
  , qos: 0
  , dup: false
  , length: 2
  , sessionPresent: false
  , returnCode: 0
}, new Buffer([
  32, 2, 0, 0
]))

testParseGenerate('connack with return code 0 session present bit set', {
   cmd: 'connack'
  , retain: false
  , qos: 0
  , dup: false
  , length: 2
  , sessionPresent: true
  , returnCode: 0
}, new Buffer([
   32, 2, 1, 0
]))

testParseGenerate('connack with return code 5', {
    cmd: 'connack'
  , retain: false
  , qos: 0
  , dup: false
  , length: 2
  , sessionPresent: false
  , returnCode: 5
}, new Buffer([
  32, 2, 0, 5
]))

testParseGenerate('minimal publish', {
    cmd: 'publish'
  , retain: false
  , qos: 0
  , dup: false
  , length: 10
  , topic: 'test'
  , payload: new Buffer('test')
}, new Buffer([
  48, 10, // Header
  0, 4, // Topic length
  116, 101, 115, 116, // Topic (test)
  116, 101, 115, 116 // Payload (test)
]))

;(function() {
  var buffer = new Buffer(2048)
  testParseGenerate('2KB publish packet', {
      cmd: 'publish'
    , retain: false
    , qos: 0
    , dup: false
    , length: 2054
    , topic: 'test'
    , payload: buffer
  }, Buffer.concat([new Buffer([
    48, 134, 16, // Header
    0, 4, // Topic length
    116, 101, 115, 116, // Topic (test)
  ]), buffer]))
})()

;(function() {
  var buffer = new Buffer(2 * 1024 * 1024)
  testParseGenerate('2MB publish packet', {
      cmd: 'publish'
    , retain: false
    , qos: 0
    , dup: false
    , length: 6 + 2 * 1024 * 1024
    , topic: 'test'
    , payload: buffer
  }, Buffer.concat([new Buffer([
    48, 134, 128, 128, 1, // Header
    0, 4, // Topic length
    116, 101, 115, 116, // Topic (test)
  ]), buffer]))
})()

testParseGenerate('maximal publish', {
    cmd:'publish'
  , retain: true
  , qos: 2
  , length: 12
  , dup: true
  , topic: 'test'
  , messageId: 10
  , payload: new Buffer('test')
}, new Buffer([
  61, 12, // Header
  0, 4, // Topic length
  116, 101, 115, 116, // Topic
  0, 10, // Message id
  116, 101, 115, 116 // Payload
]))

test('publish all strings generate', function(t) {
  var message = {
          cmd:'publish'
        , retain: true
        , qos: 2
        , length: 12
        , dup: true
        , topic: 'test'
        , messageId: 10
        , payload: new Buffer('test')
      }
    , expected = new Buffer([
        61, 12, // Header
        0, 4, // Topic length
        116, 101, 115, 116, // Topic
        0, 10, // Message id
        116, 101, 115, 116 // Payload
      ])

  t.equal(mqtt.generate(message).toString('hex'), expected.toString('hex'))
  t.end()
})

testParseGenerate('empty publish', {
    cmd: 'publish'
  , retain: false
  , qos: 0
  , dup: false
  , length: 6
  , topic: 'test'
  , payload: new Buffer(0)
}, new Buffer([
  48, 6, // Header
  0, 4, // Topic length
  116, 101, 115, 116 // Topic
  // Empty payload
]))


test('splitted publish parse', function(t) {
  t.plan(3)

  var parser = mqtt.parser()
    , rest
    , expected = {
          cmd: 'publish'
        , retain: false
        , qos: 0
        , dup: false
        , length: 10
        , topic: 'test'
        , payload: new Buffer('test')
      };

  parser.on('packet', function(packet) {
    t.deepEqual(packet, expected, 'expected packet')
  })

  t.equal(parser.parse(new Buffer([
    48, 10, // Header
    0, 4, // Topic length
    116, 101, 115, 116 // Topic (test)
  ])), 6, 'remaining bytes')


  t.equal(parser.parse(new Buffer([
    116, 101, 115, 116 // Payload (test)
  ])), 0, 'remaining bytes')
})

testParseGenerate('puback', {
    cmd: 'puback'
  , retain: false
  , qos: 0
  , dup: false
  , length: 2
  , messageId: 2
}, new Buffer([
  64, 2, // Header
  0, 2 // Message id
]))

testParseGenerate('pubrec', {
    cmd: 'pubrec'
  , retain: false
  , qos: 0
  , dup: false
  , length: 2
  , messageId: 2
}, new Buffer([
  80, 2, // Header
  0, 2 // Message id
]))

testParseGenerate('pubrel', {
    cmd: 'pubrel'
  , retain: false
  , qos: 1
  , dup: false
  , length: 2
  , messageId: 2
}, new Buffer([
  98, 2, // Header
  0, 2 // Message id
]))

testParseGenerate('pubcomp', {
    cmd: 'pubcomp'
  , retain: false
  , qos: 2
  , dup: false
  , length: 2
  , messageId: 2
}, new Buffer([
  116, 2, // Header
  0, 2 // Message id
]))

testParseError('wrong subscribe header', new Buffer([
  128, 9, // Header (subscribe, qos=0, length=9)
  0, 6, // message id (6)
  0, 4, // topic length,
  116, 101, 115, 116, // Topic (test)
  0 // qos (0)
]))

testParseGenerate('subscribe to one topic', {
    cmd: 'subscribe'
  , retain: false
  , qos: 1
  , dup: false
  , length: 9
  , subscriptions: [
      {
          topic: "test"
        , qos: 0
      }
    ]
  , messageId: 6
}, new Buffer([
  130, 9, // Header (subscribe, qos=1, length=9)
  0, 6, // message id (6)
  0, 4, // topic length,
  116, 101, 115, 116, // Topic (test)
  0 // qos (0)
]))

testParseGenerate('subscribe to three topics', {
    cmd: 'subscribe'
  , retain: false
  , qos: 1
  , dup: false
  , length: 23
  , subscriptions: [
      {
          topic: "test"
        , qos: 0
      },{
          topic: "uest"
        , qos: 1
      },{
          topic: "tfst"
        , qos: 2
      }
    ],
    messageId: 6
}, new Buffer([
  130, 23, // Header (publish, qos=1, length=9)
  0, 6, // message id (6)
  0, 4, // topic length,
  116, 101, 115, 116, // Topic (test)
  0, // qos (0)
  0, 4, // topic length
  117, 101, 115, 116, // Topic (uest)
  1, // qos (1)
  0, 4, // topic length
  116, 102, 115, 116, // Topic (tfst)
  2 // qos (2)
]))

testParseGenerate('suback', {
    cmd: 'suback'
  , retain: false
  , qos: 0
  , dup: false
  , length: 6
  , granted: [0, 1, 2, 128]
  , messageId: 6
}, new Buffer([
  144, 6, // Header
  0, 6, // Message id
  0, 1, 2, 128 // Granted qos (0, 1, 2) and a rejected being 0x80
]))

testParseGenerate('unsubscribe', {
    cmd: 'unsubscribe'
  , retain: false
  , qos: 1
  , dup: false
  , length: 14
  , unsubscriptions: [
        'tfst'
      , 'test'
    ],
    messageId: 7
}, new Buffer([
  162, 14,
  0, 7, // message id (7)
  0, 4, // topic length
  116, 102, 115, 116, // Topic (tfst)
  0, 4, // topic length,
  116, 101, 115, 116, // Topic (test)
]))

testParseGenerate('unsuback', {
    cmd: 'unsuback'
  , retain: false
  , qos: 0
  , dup: false
  , length: 2
  , messageId: 8
}, new Buffer([
  176, 2, // Header
  0, 8 // Message id
]))

testParseGenerate('pingreq', {
    cmd: 'pingreq'
  , retain: false
  , qos: 0
  , dup: false
  , length: 0
}, new Buffer([
  192, 0 // Header
]))

testParseGenerate('pingresp', {
    cmd: 'pingresp'
  , retain: false
  , qos: 0
  , dup: false
  , length: 0
}, new Buffer([
  208, 0 // Header
]))

testParseGenerate('disconnect', {
    cmd: 'disconnect'
  , retain: false
  , qos: 0
  , dup: false
  , length: 0
}, new Buffer([
  224, 0 // Header
]))

testGenerateError('unknown command', {})

testGenerateError('Invalid protocol id', {
    cmd: 'connect'
  , retain: false
  , qos: 0
  , dup: false
  , length: 54
  , protocolId: 42
  , protocolVersion: 3
  , will: {
      retain: true
    , qos: 2
    , topic: 'topic'
    , payload: 'payload'
    }
  , clean: true
  , keepalive: 30
  , clientId: 'test'
  , username: 'username'
  , password: 'password'
})

testGenerateError('clientId must be supplied before 3.1.1', {
    cmd: 'connect'
  , retain: false
  , qos: 0
  , dup: false
  , length: 54
  , protocolId: 'MQIsdp'
  , protocolVersion: 3
  , will: {
      retain: true
    , qos: 2
    , topic: 'topic'
    , payload: 'payload'
    }
  , clean: true
  , keepalive: 30
  , username: 'username'
  , password: 'password'
})

testGenerateError('clientId must be given if cleanSession set to 0', {
    cmd: 'connect'
  , retain: false
  , qos: 0
  , dup: false
  , length: 54
  , protocolId: 'MQTT'
  , protocolVersion: 4
  , will: {
      retain: true
    , qos: 2
    , topic: 'topic'
    , payload: 'payload'
    }
  , clean: false
  , keepalive: 30
  , username: 'username'
  , password: 'password'
})

testGenerateError('Invalid keepalive', {
    cmd: 'connect'
  , retain: false
  , qos: 0
  , dup: false
  , length: 54
  , protocolId: 'MQIsdp'
  , protocolVersion: 3
  , will: {
      retain: true
    , qos: 2
    , topic: 'topic'
    , payload: 'payload'
    }
  , clean: true
  , keepalive: 'hello'
  , clientId: 'test'
  , username: 'username'
  , password: 'password'
})

testGenerateError('Invalid will', {
    cmd: 'connect'
  , retain: false
  , qos: 0
  , dup: false
  , length: 54
  , protocolId: 'MQIsdp'
  , protocolVersion: 3
  , will: 42
  , clean: true
  , keepalive: 30
  , clientId: 'test'
  , username: 'username'
  , password: 'password'
})

testGenerateError('Invalid will topic', {
    cmd: 'connect'
  , retain: false
  , qos: 0
  , dup: false
  , length: 54
  , protocolId: 'MQIsdp'
  , protocolVersion: 3
  , will: {
      retain: true
    , qos: 2
    , payload: 'payload'
    }
  , clean: true
  , keepalive: 30
  , clientId: 'test'
  , username: 'username'
  , password: 'password'
})

testGenerateError('Invalid will payload', {
    cmd: 'connect'
  , retain: false
  , qos: 0
  , dup: false
  , length: 54
  , protocolId: 'MQIsdp'
  , protocolVersion: 3
  , will: {
        retain: true
      , qos: 2
      , topic: 'topic'
      , payload: 42
    }
  , clean: true
  , keepalive: 30
  , clientId: 'test'
  , username: 'username'
  , password: 'password'
})

testGenerateError('Invalid username', {
    cmd: 'connect'
  , retain: false
  , qos: 0
  , dup: false
  , length: 54
  , protocolId: 'MQIsdp'
  , protocolVersion: 3
  , will: {
      retain: true
    , qos: 2
    , topic: 'topic'
    , payload: 'payload'
    }
  , clean: true
  , keepalive: 30
  , clientId: 'test'
  , username: 42
  , password: 'password'
})

testGenerateError('Invalid password', {
    cmd: 'connect'
  , retain: false
  , qos: 0
  , dup: false
  , length: 54
  , protocolId: 'MQIsdp'
  , protocolVersion: 3
  , will: {
      retain: true
    , qos: 2
    , topic: 'topic'
    , payload: 'payload'
    }
  , clean: true
  , keepalive: 30
  , clientId: 'test'
  , username: 'username'
  , password: 42
})




