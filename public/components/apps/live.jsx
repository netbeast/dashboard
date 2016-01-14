import React from 'react'

export default class AppLiveView extends React.Component {
  render () {
    const { appName } = this.props.params
    return (
      <iframe className='app-live' src={'/i/' + appName} frameBorder='0' />
    )
  }
}
