import jQuery from 'jquery'
import React from 'react'

import App from './apps/app.jsx'
import Launcher from './launcher.jsx'

export default class Drawer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { apps: [] }
    this.loadApps = this.loadApps.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    const { route } = this.props || null
    const query = route && route.path || 'apps'
    this.loadApps(query, (err, apps) => {
      if (err) return console.error(err.message)
      this.setState({ apps: apps })
    })
  }

  componentDidMount () {
    this.loadApps('apps', (err, apps) => {
      if (err) return console.error(err.message)
      this.setState({ apps: apps })
    })
  }

  loadApps (query, done) {
    jQuery.ajax({
      url: `/${query}/`,
      dataType: 'json',
      cache: false,
      success: (data) => {
        data.forEach((app) => { app.key = app.name })
        done(null, data)
      },
      error: (xhr, status, err) => {
        done(err)
      }
    })
  }

  render () {
    const { apps } = this.state

    let installApps = (
      <a href='javascript:void(0)'>
        <h3>Install a new app <i className='fa fa-share'></i></h3>
      </a>
    )

    let allAvailableApps = (
      <span>
        <a href='javascript:void(0)'>See all apps...</a><br/>
      </span>
    )

    return (
      <span>
        <div className='drawer'>
          <h1>Apps installed</h1>
          <div className='apps-list'>
            {(apps.length < 1) ? installApps : null}
            {apps.slice(0, 6).map(function (data) {
              return <App { ...data } />
            })}
            <br/>
            {(apps.length > 6) ? allAvailableApps : null}
          </div>
        </div>
        <Launcher />
      </span>
    )
  }
}
