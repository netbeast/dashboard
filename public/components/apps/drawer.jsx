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
    console.log('component will receive props has run')
    this.loadApps(nextProps, (err, apps) => {
      if (err) return toastr.error(err)
      this.setState({ apps: apps })
    })
  }

  componentDidMount () {
    console.log('component did mount props has run')
    this.loadApps(this.props, (err, apps) => {
      if (err) return toastr.error(err)
      this.setState({ apps: apps })
    })
  }

  loadApps (props, done) {
    const { route } = props
    const query = route.path ? route.path : 'apps'

    console.log('query', query)

    request.get(`/api/${query}/`)
    .end(function (err, res) {
      if (err) return done(err)

      if (res.body.length === 0) return done(null, [])

      res.body.forEach((app) => app.type = query)

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
        <div className='drawer'>
          <h1>Apps installed</h1>
          <div className='apps-list'>
            {(apps.length < 1) ? installApps : null}
            {apps.slice(0, 6).map(function (data) {
              return <App key={data.name} { ...data } />
            })}
            <br/>
            {(apps.length > 6) ? allAvailableApps : null}
          </div>
        </div>
    )
  }
}

// Drawer.contextTypes = {
//   router: React.PropTypes.object.isRequired
// }
