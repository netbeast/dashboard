import React from 'react'
import { Link } from 'react-router'
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
      <span className='refresh-pod clickable' title='Rediscover all devices...'>
        <Link to='/' title='go back' style={{ color: 'white' }}><i className='fa fa-arrow-left'/></Link>
        &nbsp;&nbsp;&nbsp;<i className='fa fa-refresh' onClick={this.refresh.bind(this)} />
      </span>
    )
  }
}
