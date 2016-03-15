/* global toastr */

import React from 'react'
import request from 'superagent-bluebird-promise'
import { Link } from 'react-router'

import App from './app.jsx'
import { Session } from '../lib'

export default class AppsList extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = { apps: Session.load('apps') || [] }
    this.loadApps = this.loadApps.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.loadApps(nextProps)
  }

  componentDidMount () {
    this.loadApps()
  }

  loadApps (props) {
    let { src } = props || this.props
    const kind = src.split('/')[src.split('/').length - 1]

    src = kind !== 'remove' ? src : '/api/modules'

    request.get(src).end((err, res) => {
      if (err) return toastr.error(err)

      let apps = [ ...res.body ] // smart copy
      apps.forEach((app) => app.kind = kind)

      Session.save('apps', apps)
      this.setState({ apps })
    })
  }

  dismiss (appName) {
    let apps = [...this.state.apps] // smart copy
    const index = apps.findIndex((app) => { return app.name === appName })
    if (index < 0) return // do not change react component
    apps.splice(index, 1) // splice changes the array
    this.setState({ apps })
  }

  render () {
    const { apps } = this.state
    return (
      <div className='apps-list'>
        {this.props.prepend}
        {apps.map((data) => {
          return <App key={data.name} { ...data } dismiss={this.dismiss.bind(this)} />
        })}
        {this.props.append}
        <br/>
      </div>
    )
  }
}
