/* global toastr */
import request from 'superagent'
import React from 'react'

import App from './app.jsx'

export default class Explore extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = { apps: [] }
    this.loadApps = this.loadApps.bind(this)
  }

  componentWillReceiveProps () {
    console.log('have queried!')
    this.loadApps(this.props)
  }

  componentDidMount () {
    console.log('have queried!')
    this.loadApps(this.props)
  }

  loadApps (props, done) {
    const pathname = 'apps'
    const query = pathname

    request.get(`/api/${query}/`).end((err, res) => {
      if (err) return toastr.error(err)

      console.log('have queried!')
      let apps = [ ...res.body ] // smart copy
      apps.forEach((app) => app.type = pathname)

      this.setState({ apps: apps, pathname: pathname })
    })
  }

  render () {
    const { apps } = this.state

    return (
        <div className='drawer'>
          <span className='title'>
            <h1>Explore all available apps</h1>
          </span>
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
