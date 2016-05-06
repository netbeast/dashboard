import React from 'react'

export default class AppLiveView extends React.Component {
  render () {
    const { appName, path } = this.props.params
    return <iframe ref='myIframe' className='app-live' src={'/i/' + appName + ((path) ? path : '')} frameBorder='0' />
  }
}
