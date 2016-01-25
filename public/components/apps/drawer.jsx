/* global toastr */
import request from 'superagent'
import React from 'react'

import App from './app.jsx'

export default class Drawer extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = { apps: [] }
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
    const query = pathname === 'uninstall' ? 'apps' : pathname

    request.get(`/api/${query}/`).end((err, res) => {
      if (err) return toastr.error(err)

      let apps = [ ...res.body ] // smart copy
      apps.forEach((app) => app.type = pathname)

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
        title = 'Choose those apps you want to remove.'
        break
    }

    return (
      <span className='title'>
        <h1>{title}</h1>
      </span>
    )
  }

  render () {
    const { apps, pathname } = this.state

    return (
        <div className='drawer'>
          {this.renderTitle(pathname)}
          <div className='apps-list'>
            {apps.slice(0, 6).map(function (data) {
              return <App key={data.name} { ...data } />
            })}
            <br/>
          </div>
        </div>
    )
  }
}

// Drawer.contextTypes = {
//   router: React.PropTypes.object.isRequired
// }
