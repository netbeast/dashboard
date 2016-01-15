/* global toastr */
import request from 'superagent'
import React from 'react'

import App from './apps/app.jsx'

export default class Drawer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { apps: [] }
    this.loadApps = this.loadApps.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    const { route } = nextProps || this.props
    const query = route.path
    this.loadApps(query, (err, apps) => {
      if (err) return toastr.error(err)
      this.setState({ apps: apps })
    })
  }

  componentDidMount () {
    const { route } = this.props
    const query = route.path
    this.loadApps(query, (err, apps) => {
      if (err) return toastr.error(err)
      this.setState({ apps: apps })
    })
  }

  loadApps (query, done) {
    const latestQ = this.query
    if (latestQ === query) {
      return // done is never called
    } else {
      // and save latest query...
      this.query = query
    }

    request.get(`/api/${query}/`)
    .end(function (err, res) {
      if (err) return done(err)
      res.body.forEach((app) => {
        app.key = app.name
        app.type = query
      })
      done(null, res.body)
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
      </span>
    )
  }
}
