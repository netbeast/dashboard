import React from 'react'
import { Link } from 'react-router'

export default class AppLiveView extends React.Component {
  
  // componentDidMount () {
  //   const { appName } = this.props.params
  //   this.refs.myIframe.src = '/i/' + appName
  // }

  render () {
    const { appName } = this.props.params
    return (
      <span>
        <div className='live-return-menu'>
          <Link to='/'> Go back to Netbeast dashboard.</Link>
        </div>
        <iframe ref='myIframe' className='app-live' src={'/i/' + appName} frameBorder='0' />
      </span>
    )
  }
}
