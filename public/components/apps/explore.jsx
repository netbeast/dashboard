import request from 'superagent'
import React from 'react'
import async from 'async'

import App from './app.jsx'

export default class Explore extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = { apps: [] }
    this.loadApps = this.loadApps.bind(this)
  }

  componentWillReceiveProps () {
    console.log('have queried!')
    this.loadApps()
  }

  componentDidMount () {
    console.log('have queried!')
    this.loadApps()
  }

  loadApps (props, done) {
    const GITHUB_REPO = 'https://api.github.com/repos/netbeast/apps/contents/'
    const GITHUB_RAW = 'https://raw.githubusercontent.com/netbeast/apps/master/'

    console.log('have queried!')
    request.get(GITHUB_REPO).end((err, response) => {
      if (err) return window.toastr.error(err)

      async.map(response.body, (app, done) => {
        if (app.name === 'README.md') return done()

        request.get(GITHUB_RAW + app.name + '/package.json').end((err, resp) => {
          if (err) return window.toastr.error(err)
          this.setState({ apps: [ JSON.parse(resp.text), ...this.state.apps ] })
        })
      })
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
