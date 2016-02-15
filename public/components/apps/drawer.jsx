/* global toastr */
import request from 'superagent-bluebird-promise'
import React from 'react'
import { Link } from 'react-router'

import { Session } from '../lib'

import VersionPod from '../misc/version-pod.jsx'
import DevicesPod from '../misc/devices-pod.jsx'
import App from './app.jsx'

class ExploreApp extends React.Component {
  render () {
    const { route } = this.props
    const pathname = route.path ? route.path : 'apps'
    const logoStyle = { backgroundImage: 'url(/img/explore.png)' }

    if (pathname !== 'apps') return null

    return (
      <div className='app app-explore'>
        <Link to='/explore'>
          <div className='logo' title='Launch app' style={logoStyle} />
        </Link>
        <h4 className='name'> Explore </h4>
      </div>
    )
  }
}

export default class Drawer extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = { apps: Session.load('apps') || [] }
    this.loadApps = this.loadApps.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.loadApps(nextProps)
  }

  componentDidMount () {
    this.loadApps(this.props)
  }

  loadApps (props, done) {
    const { route } = props
    const pathname = route.path ? route.path : 'apps'
    const query = pathname === 'uninstall' ? 'modules' : pathname

    request.get(`/api/${query}/`).end((err, res) => {
      if (err) return toastr.error(err)

      let apps = [ ...res.body ] // smart copy
      apps.forEach((app) => app.type = pathname)

      Session.save('apps', apps)
      this.setState({ apps: apps, pathname: pathname })
    })
  }

  renderTitle (pathname) {
    let title = ''

    switch (pathname) {
      case 'apps':
        title = 'Apps installed.'
        break
      case 'plugins':
        title = 'Plugins installed.'
        break
      case 'activities':
        title = 'Applications running.'
        break
      case 'uninstall':
        title = 'Remove any module.'
        break
    }

    return (
      <div className='title'>
        <h3>{title}</h3>
      </div>
    )
  }

  render () {
    const { apps, pathname } = this.state

    return (
        <div className='drawer'>
          <div className='apps-list'>
            {this.renderTitle(pathname)}
            <ExploreApp {...this.props} />
            {apps.map(function (data) {
              return <App key={data.name} { ...data } />
            })}
            <br/>
          </div>
          <DevicesPod />
          <VersionPod />
        </div>
    )
  }
}

// Drawer.contextTypes = {
//   router: React.PropTypes.object.isRequired
// }
