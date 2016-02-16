import React from 'react'
import mqtt from 'mqtt'

import { Session } from '../lib'
import VersionPod from './version-pod.jsx'
import DevicesPod from './devices-pod.jsx'

class Device extends React.Component {
  render () {
    const { app } = this.props
    const icon = app ? `/api/apps/${app}/logo` : '/img/dflt.png'

    return (
      <div className='device'>
        <div className='icon'>
          <img src={icon} alt={icon} />
        </div>
        <ul className='fields list-unstyled'>
          {Object.keys(this.props).map((key, idx) => {
            return <li key={idx} className='field'>{key}: {this.props[key]}</li>
          })}
        </ul>
      </div>
    )
  }
}

export default class Devices extends React.Component {
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
      <span>
        <div className='devices-list'>
        <h1>{devices.length} devices connected</h1>
          {devices.map((data, idx) => { return <Device key={idx} {...data} /> })}
        </div>
        <VersionPod />
      </span>
    )
  }
}
