import request from 'superagent-bluebird-promise'
import React from 'react'

import VersionPod from '../misc/version-pod.jsx'
import DevicesPod from '../misc/devices-pod.jsx'
import App from './app.jsx'

export default class Explore extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = { apps: [] }
  }

  componentDidMount () {
    const GITHUB_Q = 'https://api.github.com/search/repositories?q=netbeast+language:javascript'

    request.get(GITHUB_Q).end((err, res) => {
      if (err) return window.toastr.error(err)
      const { items } = JSON.parse(res.text)
      this.setState({ apps: [ ...items ] })
    })
  }

  render () {
    const { apps } = this.state

    return (
        <div className='drawer'>
          <div className='title'>
            <h1>Explore all available apps.</h1>
          </div>
          <div className='apps-list'>
            {apps.map(function (data) {
              return <App key={data.id} { ...data } type='explore' />
            })}
            <br/>
          </div>
          <DevicesPod />
          <VersionPod />
        </div>
    )
  }
}
