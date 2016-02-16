import React from 'react'

export default class VersionPod extends React.Component {
  constructor () {
    super()
  }

  render () {
    const version = '0.2.4'
    return (
      <span className='version-pod' title='Checking for updates...'>
        v{version}
      </span>
    )
  }
}
