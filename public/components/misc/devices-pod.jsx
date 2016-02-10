import React from 'react'
import mqtt from 'mqtt'

export default class DevicesPod extends React.Component {
  constructor () {
    super()
    this.mqtt = mqtt.connect()
    this.state = { devices: [] }
  }

  componentWillMount () {
    this.mqtt.subscribe('netbeast/network')
    this.mqtt.on('message', (topic, message) => {
      if (topic !== 'netbeast/network') return

      const devices = JSON.parse(message)
      this.setState({ devices })
    })
  }

  componentWillUnmount () {
    this.mqtt.unsubscribe('netbeast/network')
  }

  render () {
    const { devices } = this.state
    return (
      <span className='devices-pod' title='Checking for updates...'>
        {devices.length} devices connected
      </span>
    )
  }
}
