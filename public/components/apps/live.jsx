import React from 'react'

export default class AppLiveView extends React.Component {
  render () {
    const { appName } = this.props.params
    const iframeSource = '/i/' + appName + '?no_cache=' + Date.now()
    return (
      <iframe className='app-live' src={iframeSource} frameBorder='0' />
    )
  }
}
