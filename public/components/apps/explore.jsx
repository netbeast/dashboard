import request from 'superagent-bluebird-promise'
import React from 'react'

import VersionPod from '../misc/version-pod.jsx'
import DevicesPod from '../misc/devices-pod.jsx'
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

    request.get('/api/apps').end((err, res) => {
      if (err) return window.toastr.error(err)
      this.setState({ installedApps: [ ...res.body ] })
    })
  }

  isInstalled (appName) {
    let apps = [ ...this.state.installedApps ] // smart copy
    const index = apps.findIndex((app) => { return app.name === appName })
    console.log(appName, index)
    return index >= 0
  }

  render () {
    const { apps } = this.state

    return (
        <div className='drawer'>
          <div className='title'>
            <h1>Explore all available apps.</h1>
          </div>
          <div className='apps-list'>
            {apps.map((data) => {
              return <ExplorableApp key={data.id} { ...data } installed={this.isInstalled(data.name)}/>
            })}
            <br/>
          </div>
          <DevicesPod />
          <VersionPod />
        </div>
    )
  }
}
