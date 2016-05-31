import React from 'react'

export default class VersionPod extends React.Component {
  constructor () {
    super()
  }

  render () {
    const version = process.env.VERSION
    return (
      <a target='_blank' href='https://github.com/netbeast/dashboard' className='version-pod' title='npm package version'>
        Beta v{version}
      </a>
    )
  }
}
