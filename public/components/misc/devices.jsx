import React from 'react'
import mqtt from 'mqtt'
import { OverlayTrigger, Popover } from 'react-bootstrap'

import { Session } from '../lib'
import VersionPod from './version-pod.jsx'
import DevicesPod from './devices-pod.jsx'

class FilterSVG extends React.Component {
  render () {
    const { src } = this.props
    const icon = src === 'default' ? '/img/dflt.png' : `/api/apps/${src}/logo`

    return (
      <filter id={src} x='0%' y='0%' width='100%' height='100%'>
        <feImage xlinkHref={icon} />
      </filter>
    )
  }
}

class DeviceDot extends React.Component {
  render () {
    const { app, idx } = this.props
    const offset = _coords(idx)

    const style = {
      filter: `url(#${app || 'default'})`
    }

    const popover = (
      <Popover id={idx}>
        <ul className='list-unstyled'>
        {Object.keys(this.props).map((key, idx) => {
          if (key === 'idx') return null
          return <li key={idx} className='field'>{key}: {this.props[key]}</li>
        })}
        </ul>
      </Popover>
    )

    return (
      <OverlayTrigger trigger={['click']} placement='top' overlay={popover}>
        <circle cx={offset.x - 12.5} cy={offset.y - 12.5} r='25' style={style} />
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
    const filters = [ ... new Set(devices.map((data) => { return data.app || 'default' }))]

    return (
      <span>
        <div className='devices-list'>
        <h1>{devices.length} devices connected</h1>
          <svg height='500' width='500' viewBox='-250 -250 500 500'>
          <g transform='scale(1,-1)'>

          {filters.map((src, idx) => {
            return <FilterSVG key={src} src={src}/>
          })}
          <filter id={'netbot'} x='0%' y='0%' width='100%' height='100%'>
            <feImage xlinkHref='/img/netbot.png' />
          </filter>
          <circle cx={0} cy={0} r='50' style={{ filter: 'url(#netbot)' }} />

          {devices.map((data, idx) => {
            return <DeviceDot key={idx} {...data} idx={idx} />
          })}
          </g>
          </svg>
        </div>
        <VersionPod />
      </span>
    )
  }
}

// Accepts number of devices "n", return coords {x, y}
function _coords (n) {
  const r = 160 + Math.floor(n / 6) * 80
  const N = 6
  const w = Math.floor(n / 6) * 1 / 12

  return {
    x: r * Math.cos(2 * Math.PI * (n / N + w)),
    y: r * Math.sin(2 * Math.PI * (n / N + w))
  }
}
