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
    const GITHUB_Q = 'https://api.github.com/search/repositories?q=netbeast+language:javascript'

    request.get(GITHUB_Q).end((err, res) => {
      if (err) return window.toastr.error(err)
      const { items } = JSON.parse(res.text)
      this.setState({ apps: [ ...items] })
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
              return <App key={data.id} { ...data } />
            })}
            <br/>
          </div>
        </div>
    )
  }
}
