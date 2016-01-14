import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'

import Drawer from './drawer.jsx'
import Launcher from './launcher.jsx'
import Notifications from './notifications'
import Settings from './settings.jsx'
import NotFound from './not-found.jsx'
import AppLiveView from './apps/live.jsx'

class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.getPathClassName = this.getPathClassName.bind(this)
    this.state = { path: this.getPathClassName() }
  }

  getPathClassName (nextProps) {
    const { location } = nextProps || this.props
    const regexp = new RegExp('/', 'g')
    let pathname = location.pathname.replace(regexp, '-')
    pathname = (pathname === '-') ? '-root' : pathname

    console.log('pathname:', pathname)
    return pathname
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ path: this.getPathClassName(nextProps) })
  }

  render () {
    const { path } = this.state
    return (
      <div id='dashboard' className={`path${path}`}>
        <Notifications />
        <main>
          {this.props.children || <Drawer />}
        </main>
        <Launcher />
      </div>
    )
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={Dashboard}>
      <Route path='' component={Drawer} />
      <Route path='apps' component={Drawer} />
      <Route path='activities' component={Drawer} />
      <Route path='plugins' component={Drawer} />
      <Route path='about' component={Drawer} />
      <Route path='settings' component={Settings} />
      <Route path='i/:appName' component={AppLiveView} />
      <Route path='*' component={NotFound} />
    </Route>
  </Router>
, document.getElementById('app'))
