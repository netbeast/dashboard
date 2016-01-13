import jQuery from 'jquery'
import React from 'react'

import App from './apps/app.jsx'
import Launcher from './launcher.jsx'

export default class Drawer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { apps: [] }
  }

  componentDidMount () {
    jQuery.ajax({
      url: '/apps/',
      dataType: 'json',
      cache: false,
      success: (data) => {
        data.forEach((app) => { app.key = app.name })
        this.setState({ apps: data })
      },
      error: (xhr, status, err) => {
        console.error('/apps/', status, err.toString())
      }
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
      <span>
        <div className='drawer'>
          <h1>Apps installed</h1>
          <div className='apps-list'>
            {(apps.length < 1) ? installApps : null}
            {apps.slice(0, 6).map(function (data) {
              return <App { ...data } />
            })}
            <br/>
            {(apps.length > 6) ? allAvailableApps : null}
          </div>
        </div>
        <Launcher />
      </span>
    )
  }
}
