import React from 'react'

export default class AppLiveView extends React.Component {
  render () {
    const { appName } = this.props.params
    return (
      <iframe id='live' src={'/i/' + appName} frameBorder='0'></iframe>
    )
  }
}
