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
          <div>
          <ul className='collapsed list-unstyled list-inline pull-left'>
            <li>
              <i className='fa fa-close clickable' onClick={this.toggleDrawer} />
            </li>
          </ul>
          </div>
          <Link to='/'><h1 className='pull-left'>{this.state.title}</h1></Link>
          <br/>
          <br/>
          <ul className='expanded list-unstyled'>
            <li><Link to='/'><i className='fa fa-th' /> Apps</Link></li>
            <li><Link to='/plugins'><i className='fa fa-puzzle-piece' /> Plugins</Link></li>
            <li><Link to='/activities'><i className='fa fa-dashboard' /> Activities</Link></li>
            <li><Link to='/remove'> <i className='fa fa-trash' /> Remove</Link></li>
          </ul>
        </nav>
      </span>
    )
  }
}
