import React from 'react'
import { Link } from 'react-router'

export default class NotFound extends React.Component {
  render () {
    return (
      <div className='not-found'>
      <h1>Page not found</h1>
        <ul>
          <li><Link to='apps'>Apps</Link></li>
          <li><Link to='activities'>Activities</Link></li>
          <li><Link to='plugins'>Plugins</Link></li>
          <li><Link to='uninstall'>Uninstall</Link></li>
          <li><Link to='settings'>Settings</Link></li>
        </ul>
      </div>
    )
  }
}
