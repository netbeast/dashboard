import React from 'react'
import request from 'superagent-bluebird-promise'
import Promise from 'bluebird'

export default class VersionPod extends React.Component {

  refresh () {
    const APP_PROXY = '/i/'
    request.get('/api/plugins').then((res) => {
      console.log(res)
      return Promise.map(res.body, (plugin) => {
        return request.get(APP_PROXY + plugin.name + '/discover').promise()
      })
    })
  }

  render () {
    return (
      <span className='refresh-pod cickable' title='Rediscover all devices...'>
        <i className='fa fa-refresh' onClick={this.refresh.bind(this)}> Rediscover all devices</i>
      </span>
    )
  }
}
