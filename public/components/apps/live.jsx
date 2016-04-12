import React from 'react'
import { Link } from 'react-router'

export default class AppLiveView extends React.Component {
  render () {
    const { appName, path } = this.props.params
    return (
      <span>
      <iframe className='app-live' src={'/i/' + appName + ((path) ? path : '')} frameBorder='0' />
      <div className='live-return-menu'>
        <Link to='/'> Go back to Netbeast dashboard.</Link>
      </div>
      </span>
    )
  }
}
