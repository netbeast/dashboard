import request from 'superagent-bluebird-promise'
import React from 'react'
import { Link } from 'react-router'
import Typist from 'react-typist'

import VersionPod from '../misc/version-pod.jsx'
import ExplorableApp from './explorable-app.jsx'

export default class Explore extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.router = context.router
    this.state = {
      apps: [],
      installedApps: [],
      filter: this.props.location.query
    }

    /* Methods */
    this.isInstalled = this.isInstalled.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onFocus = this.onFocus.bind(this)
  }

  componentDidMount () {
    const GITHUB_Q = 'https://api.github.com/search/repositories?q=netbeast+language:javascript'

    request.get(GITHUB_Q).end((err, res) => {
      if (err) return window.toastr.error(err)

      let modules = JSON.parse(res.text).items.filter((app) => {
        return app.name !== 'dashboard' && app.name !== 'api'
      })

      this.setState({ apps: modules })
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

  onSubmit () {
    return
  }

  onChange () {
    return
  }

  onFocus () {
    this.setState({ filter: this.refs.search.value })
  }

  render () {
    const { filter, apps } = this.state

    return (
        <div className='drawer'>
          <div className='apps-list'>
            {apps.map((data) => {
                return <ExplorableApp key={data.id} { ...data } filter={filter} installed={this.isInstalled(data.name)}/>
            })}
            <span style={{ display: apps.length > 0 ? 'none' : 'block' }}><Typist>
              Looking for Netbeast packages on the registry...
            </Typist></span>
          </div>
          <form className='module-search' onSubmit={this.onSubmit}>
            <i className='fa fa-search'/>
            <input ref='search' name='url' type='url' onFocus={this.onFocus} onChange={this.onFocus} placeholder='Search here or paste a git url to install' />
            <input type='submit' className='btn btn-inverted' value='install' />
          </form>
          <VersionPod />
        </div>
    )
  }
}
