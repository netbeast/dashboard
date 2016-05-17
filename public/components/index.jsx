import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router'

import NotFound from './not-found.jsx'

import Notifications from './notifications'
import Drawer from './apps/drawer.jsx'
import AppLiveView from './apps/live.jsx'
import InstallView from './apps/install.jsx'
import Explore from './apps/explore.jsx'
import { Devices, DevicesNavigation } from './devices/index.jsx'
import History from './history/index.jsx'
import FeedbackPod from './misc/feedback-pod.jsx'
import ConnectionPod from './misc/connection-pod.jsx'
import Login from './user/login.jsx'
import UserPod from './user/user-pod.jsx'
import NotificationsPod from './notifications/notifications-pod.jsx'
import Signup from './user/signup.jsx'
import Settings from './user/settings.jsx'

import { Auth } from './lib'

export class Navigation extends React.Component {
  constructor () {
    super()
    this.state = { title: 'Netbeast', hideDrawer: true }
    window.title = this.title.bind(this)
    this.toggleDrawer = this.toggleDrawer.bind(this)
  }

  title (str) {
    if (str) {
      this.setState({ title: str })
      document.title = str
    }
    return document.title
  }

  toggleDrawer () {
    this.setState({ hideDrawer: !this.state.hideDrawer })
  }

  render () {
    const marginLeft = -300 * this.state.hideDrawer
    console.log('marginLeft', marginLeft)
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
        <nav className='navigation-drawer' style={{ 'margin-left': marginLeft }}>
          <p>
          <ul className='collapsed list-unstyled list-inline pull-left'>
            <li>
              <i className='fa fa-close clickable' onClick={this.toggleDrawer} />
            </li>
          </ul>
          </p>
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

export default class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.getPathClassName = this.getPathClassName.bind(this)
    this.state = { path: this.getPathClassName() }
  }

  getPathClassName (nextProps) {
    const { location } = nextProps || this.props
    const regexp = new RegExp('/', 'g')
    const pathname = location.pathname.replace(regexp, '-')
    return (pathname === '-') ? '-root' : pathname
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ path: this.getPathClassName(nextProps) })
  }

  render () {
    const { nav, main } = this.props
    let { path } = this.state
    path = path.indexOf('live') > -1 ? '-live' : path

    return (
      <div id='dashboard' className={`path${path}`}>
        <FeedbackPod />
        <ConnectionPod />
        <Notifications />
        <div style={{ width: '100%', height: 70 }}>
          {nav || <Navigation />}
        </div>
        <main>
          {main || this.props.children}
        </main>
      </div>
    )
  }
}

Dashboard.propTypes = {
  children: React.PropTypes.element
}

const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
window.mqttUri = protocol + window.location.host

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={Dashboard}>
      <IndexRoute component={Drawer} />
      <Route path='activities' component={Drawer} />
      <Route path='plugins' component={Drawer} />
      <Route path='about' component={Drawer} />
      <Route path='remove' component={Drawer} />
      <Route path='explore' component={Explore} >
        <Route path=':filter' component={Explore} />
      </Route>
      <Route path='install' component={InstallView} />
      <Route path='history' component={History} />
      <Route path='network' components={Devices} />
      <Route path='login' component={Login} />
      <Route path='settings' onEnter={Auth.isLogged} component={Settings} />
      <Route path='signup' component={Signup} />
      <Route path='live/:appName' component={AppLiveView} />
      <Route path='live/:appName/:path' component={AppLiveView} />
      <Route path='*' component={NotFound} />
    </Route>
  </Router>
, document.getElementById('render-target'))
