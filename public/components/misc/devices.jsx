import React from 'react'
import mqtt from 'mqtt'
import { OverlayTrigger, Popover } from 'react-bootstrap'

import { Session } from '../lib'
import VersionPod from './version-pod.jsx'
import DevicesPod from './devices-pod.jsx'

class FilterSVG extends React.Component {
  render () {
    const { app, idx } = this.props
    const icon = app ? `/api/apps/${app}/logo` : '/img/dflt.png'

    return (
      <filter id={app || 'default'} x='0%' y='0%' width='100%' height='100%'>
        <feImage xlinkHref={icon} />
      </filter>
    )
  }
}

class DeviceDot extends React.Component {
  render () {
    const { app, idx } = this.props
    const offset = { x: _rndSign() * (Math.random() * 50 + 50), y: _rndSign() * (Math.random() * 50 + 50) }
    const style = {
      filter: `url(#${app || 'default'})`
    }

    const popover = <Popover id={idx}><strong>Holy guacamole!</strong> Check this info.</Popover>

    return (
      <OverlayTrigger trigger={['click']} placement='top' overlay={popover}>
        <circle cx={offset.x} cy={offset.y} r='25' style={style} />
      </OverlayTrigger>
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
          <svg height='500' width='500' viewBox='-250 -250 500 500'>
          <g transform='scale(1,-1)'>

          <filter id={'netbot'} x='0%' y='0%' width='100%' height='100%'>
            <feImage xlinkHref='/img/netbot.png' />
          </filter>
          <circle cx={0} cy={0} r='50' style={{ filter: 'url(#netbot)' }} />

          {devices.map((data, idx) => {
            return [
              <FilterSVG key={'filter-' + idx} {...data} idx={idx}/>,
              <DeviceDot key={idx} {...data} idx={idx} />
            ]
          })}
          </g>
          </svg>
        </div>
        <VersionPod />
      </span>
    )
  }
}

function _rndSign () {
  return Math.random() < 0.5 ? -1 : 1
}
