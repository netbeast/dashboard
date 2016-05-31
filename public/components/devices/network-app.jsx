import React from 'react'
import { Link } from 'react-router'
import mqtt from 'mqtt'

import { Session } from '../lib'

export default class NetworkApp extends React.Component {
  constructor () {
    super()
    this.mqtt = mqtt.connect(window.mqttUri)
    this.state = { devicesNumber: Session.load('devices') ? Session.load('devices').length : 0 }
  }

  componentWillMount () {
    this.mqtt.subscribe('netbeast/network')
    this.mqtt.on('message', (topic, message) => {
      if (topic !== 'netbeast/network') return

      const devices = JSON.parse(message)
      this.setState({ devicesNumber: devices.length })
    })
  }

  componentWillUnmount () {
    this.mqtt.unsubscribe('netbeast/network')
  }

  render () {
    const { devicesNumber } = this.state
    const { route } = this.props
    const pathname = route.path ? route.path : 'apps'
    const logoStyle = { backgroundImage: 'url(/img/network.png)' }

    if (pathname !== 'apps') return null

    return (
      <div className='app network-app'>
        { devicesNumber ?
          <div className='network-app-badge'>
            <span className='content'>{devicesNumber}</span>
          </div> : null
        }
        <Link to='/network'>
          <div className='logo' title='Open network explorer' style={logoStyle} />
        </Link>
        <h4 className='name'> Network </h4>
      </div>
    )
  }
}
