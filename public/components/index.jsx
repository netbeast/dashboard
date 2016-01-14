import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'

import Drawer from './drawer.jsx'
import Notifications from './notifications.jsx'
import Settings from './settings.jsx'
import NotFound from './not-found.jsx'
import AppLiveView from './apps/live.jsx'

class Dashboard extends React.Component {
  render () {
    return (
      <div id='dashboard'>
        <Notifications />
        <main>
          {this.props.children || <Drawer />}
        </main>
      </div>
    )
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={Dashboard}>
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
