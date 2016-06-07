import request from 'superagent-bluebird-promise'
import React from 'react'
import Typist from 'react-typist'

import VersionPod from '../misc/version-pod.jsx'
import ExplorableApp from './explorable-app.jsx'

const GITHUB_API = 'https://api.github.com'
const GITHUB_Q = GITHUB_API + '/search/repositories?q=netbeast+language:javascript&user:netbeast'

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
    this.query = this.query.bind(this)
    this.isInstalled = this.isInstalled.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onFocus = this.onFocus.bind(this)
    // this.onBlur = this.onBlur.bind(this)
  }

  componentDidMount () {
    this.query(GITHUB_Q)
    window.title('Explore ' + (this.state.filter.type || 'apps & plugins'))

    request.get('/api/modules').end((err, res) => {
      if (err) return window.toastr.error(err)
      this.setState({ installedApps: [ ...res.body ] })
    })
  }

  query (str) {
    request.get(str || GITHUB_Q).end((err, res) => {
      if (err && err.res) return window.toastr.error(err.res.text)
      if (err) return window.toastr.error(err.message)

      let result = JSON.parse(res.text)
      result = result.items ? result.items : [result]
      let modules = result.filter((app) => {
        return app.name !== 'dashboard' && app.name !== 'api' && app.name !== 'workshop'
      })

      this.setState({ apps: modules })
    })
  }

  isInstalled (appName) {
    const apps = [ ...this.state.installedApps ] // smart copy
    const index = apps.findIndex((app) => { return app.name === appName })
    return index >= 0
  }

  onSubmit () {
    return
  }

  onChange (event) {
    const searchText = event.target.value.toLowerCase()
    if (!searchText) return this.setState({ apps: this.cachedApps })

    const repo = getRepo(searchText)
    if (repo) return this.query(GITHUB_API + '/repos' + repo)

    const apps = this.cachedApps.filter(function (app) {
      return app.name.toLowerCase().includes(searchText)
    })

    this.setState({ apps })
  }

  onFocus () {
    const { filter, apps } = this.state
    this.cachedApps = apps
    filter.type = undefined
    filter.name = this.refs.search.value
    this.setState({ filter })
    this.router.push('/explore')
    window.title('Explore apps & plugins')
  }

  render () {
    const { filter, apps } = this.state
    return (
        <div className='explore-drawer'>
          <div className='apps-list'>
            {apps.map((data) => {
              return <ExplorableApp key={data.id} { ...data } filter={filter} installed={this.isInstalled(data.name)}/>
            })}
            <h3 style={{ display: apps.length > 0 ? 'none' : 'block' }}>
            <br/>
            <br/>
            <br/>
            <Typist>
              Looking for Netbeast packages on the registry...
            </Typist>
            </h3>
          </div>
          <div>
            <a target='_blank' style={{ color: '#555' }}
            href='https://docs.netbeast.co/chapters/developing/publish.html'>
            Didn't find yours? Publish your app or plugin.
            </a>
          </div>
          <form className='module-search' onSubmit={this.onSubmit}>
            <i className='fa fa-search'/>
            <input ref='search' name='url' type='url' onFocus={this.onFocus} onChange={this.onChange} placeholder='Search here or paste a git url to install' autoComplete='off' />
            <input type='submit' className='btn btn-inverted' value='install' />
          </form>
          <VersionPod />
        </div>
    )
  }
}

Explore.contextTypes = {
  router: React.PropTypes.object.isRequired
}

function getRepo (s) {
  const regexp = /(git|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  if (!regexp.test(s)) return undefined

  const anchor = document.createElement('a')
  anchor.href = s
  return anchor.pathname
}
