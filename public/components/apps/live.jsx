import React from 'react'
import { Link } from 'react-router'

export default class AppLiveView extends React.Component {
  render () {
    const { appName } = this.props.params
    return (
      <span>
      <iframe className='app-live' src={'/i/' + appName} frameBorder='0' />
      <div className='live-return-menu'>
        <Link to='/'> Go back to Netbeast dashboard.</Link>
      </div>
      </span>
    )
  }
}
