import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'

import NotificationsPod from './notifications/notifications-pod.jsx'
import UserPod from './user/user-pod.jsx'

export class Navigation extends React.Component {
  constructor () {
    super()
    this.state = { title: 'Netbeast', hideDrawer: true }
    window.title = this.title.bind(this)
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.hideDrawer = this.hideDrawer.bind(this)
  }

  title (str) {
    if (str) {
      this.setState({ title: str })
      document.title = str
    }
    return document.title
  }

  hideDrawer (e) {
    if (!ReactDOM.findDOMNode(this).contains(e.target)) {
      this.setState({ hideDrawer: true })
    }
  }

  componentWillMount () {
    document.addEventListener('click', this.hideDrawer, false)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.hideDrawer, false)
  }

  toggleDrawer () {
    this.setState({ hideDrawer: !this.state.hideDrawer })
  }

  render () {
    const marginLeft = -300 * this.state.hideDrawer

    return (
      <span>
        <nav className='navigation-bar'>
          <ul className='collapsed list-unstyled list-inline pull-left'>
            <li>
              <i className='fa fa-bars clickable' onClick={this.toggleDrawer} />
            </li>
          </ul>
          <Link to='/'><h1 className='pull-left'>{this.state.title}</h1></Link>
          <ul className='expanded list-unstyled list-inline pull-left'>
            <li><Link to='/'><i className='fa fa-th' /> Apps</Link></li>
            <li><Link to='/plugins'><i className='fa fa-puzzle-piece' /> Plugins</Link></li>
            <li><Link to='/activities'><i className='fa fa-dashboard' /> Activities</Link></li>
            <li><Link to='/remove'> <i className='fa fa-trash' /> Remove</Link></li>
          </ul>
          <UserPod />
          <NotificationsPod />
        </nav>
        <nav className='navigation-drawer' style={{ marginLeft }}>
          <div className='navigation-drawer__heading'>
            <div className='navigation-drawer__heading__content'>
              <span className='fa fa-close clickable' onClick={this.toggleDrawer} />
              &nbsp;
              <Link to='/'>{this.state.title}</Link>
            </div>
          </div>
          <ul className='expanded list-unstyled'>
            <Link to='/'><li><i className='fa fa-th' /> &nbsp;Apps</li></Link>
            <Link to='/plugins'><li><i className='fa fa-puzzle-piece' /> &nbsp;Plugins</li></Link>
            <Link to='/activities'><li><i className='fa fa-dashboard' /> &nbsp;Activities</li></Link>
            <Link to='/remove'><li><i className='fa fa-trash' /> &nbsp;Remove</li></Link>
          </ul>
        </nav>
      </span>
    )
  }
}
