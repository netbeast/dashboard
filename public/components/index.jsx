import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import Settings from './settings.jsx'
import NotFound from './not-found.jsx'

import Drawer from './apps/drawer.jsx'
import AppLiveView from './apps/live.jsx'
import InstallView from './apps/install.jsx'
import Explore from './apps/explore.jsx'
import Devices from './devices/index.jsx'

import Dashboard from './dashboard.jsx'

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
      <Route path='explore' component={Explore} />
      <Route path='install' component={InstallView} />
      <Route path='settings' component={Settings} />
      <Route path='devices' component={Devices} />
      <Route path='i/:appName' component={AppLiveView} />
      <Route path='*' component={NotFound} />
    </Route>
  </Router>
, document.getElementById('app'))
