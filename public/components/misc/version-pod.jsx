import React from 'react'

export default class VersionPod extends React.Component {
  constructor () {
    super()
  }

  render () {
    const version = process.env.VERSION
    return (
      <span className='version-pod' title='Checking for updates...'>
        Beta v{version}
      </span>
    )
  }
}
