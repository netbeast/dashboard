import React from 'react'

export default class VersionPod extends React.Component {
  constructor () {
    super()
    this.state = { version: '0.2.4' }
  }

  render () {
    const { version } = this.state
    return (
      <span className='version-pod' title='Checking for updates...'>
        v{version}
      </span>
    )
  }
}
