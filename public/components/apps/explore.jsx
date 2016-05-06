import request from 'superagent-bluebird-promise'
import React from 'react'
import { Link } from 'react-router'

import VersionPod from '../misc/version-pod.jsx'
import ExplorableApp from './explorable-app.jsx'

export default class Explore extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = { apps: [], installedApps: [] }
    this.isInstalled = this.isInstalled.bind(this)
  }

  componentDidMount () {
    const GITHUB_Q = 'https://api.github.com/search/repositories?q=netbeast+language:javascript'

    request.get(GITHUB_Q).end((err, res) => {
      if (err) return window.toastr.error(err)
      const items = JSON.parse(res.text).items.filter((app) => {
        return app.name !== 'dashboard' && app.name !== 'api'
      })
      this.setState({ apps: [ ...items ] })
    })

    request.get('/api/modules').end((err, res) => {
      if (err) return window.toastr.error(err)
      this.setState({ installedApps: [ ...res.body ] })
    })
  }

  isInstalled (appName) {
    let apps = [ ...this.state.installedApps ] // smart copy
    const index = apps.findIndex((app) => { return app.name === appName })
    return index >= 0
  }

  renderNav () {
    return (
      <div className='nav'>
        <span className='title'><h4>All available apps.</h4></span>
        <ul className='list-unstyled list-inline'>
          <li><Link to='/'><i className='fa fa-th' /> Apps</Link></li>
          <li><Link to='/plugins'><i className='fa fa-package'><img src='/img/plugin.png'/></i> Plugins</Link></li>
          <li><Link to='/activities'><i className='fa fa-dashboard' /> Activities</Link></li>
          <li><Link to='/install'> <i className='fa fa-package'><img src='/img/package-unfilled.png'/></i> Install</Link></li>
          <li><Link to='/remove'> <i className='fa fa-trash' /> Remove</Link></li>
        </ul>
      </div>
    )
  }

  handleSubmit () {

  }

  handleChange () {

  }

  render () {
    const { apps } = this.state

    return (
        <div className='drawer'>
        {this.renderNav()}
          <div className='apps-list'>
            {apps.map((data) => {
              return <ExplorableApp key={data.id} { ...data } installed={this.isInstalled(data.name)}/>
            })}
            <br/>
          </div>
          <form className='module-search' onSubmit={this.handleSubmit.bind(this)}>
            <i className='fa fa-search'/> 
            <input name='url' type='url' onChange={this.handleChange.bind(this)} placeholder='Search here or paste a git url to install' />
            <input type='submit' className='btn btn-inverted' value='install' />
          </form>
          <VersionPod />
        </div>
    )
  }
}
