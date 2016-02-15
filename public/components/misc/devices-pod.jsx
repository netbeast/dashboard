import React from 'react'
import { Link } from 'react-router'
import mqtt from 'mqtt'

import { Session } from '../lib'

export default class DevicesPod extends React.Component {
  constructor () {
    super()
    this.mqtt = mqtt.connect()
    this.state = { devices: Session.load('devices') || [] }
  }

  componentWillMount () {
    this.mqtt.subscribe('netbeast/network')
    this.mqtt.on('message', (topic, message) => {
      if (topic !== 'netbeast/network') return

      const devices = JSON.parse(message)
      Session.save('devices', devices)
      this.setState({ devices })
    })
  }

  componentWillUnmount () {
    this.mqtt.unsubscribe('netbeast/network')
  }

  render () {
    const { devices } = this.state
    return (
      <Link to='devices' className='devices-pod' title='Checking for updates...'>
        {devices.length} devices connected
      </Link>
    )
  }
}
