import React from 'react'

export default class DevicesPod extends React.Component {
  constructor () {
    super()
    this.state = { devices: ['karaoke', 'trialdevice'] }
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
