/* global toastr */
import React from 'react'
import request from 'superagent-bluebird-promise'
import Promise from 'bluebird'

export default class RefreshPod extends React.Component {

  refresh () {
    const APP_PROXY = '/i/'
    const loader = window.notify({
      body: (
        <span>
         <div className='loader'></div>
         Scanning for new devices...
        </span>
      ), timeout: 0}
    )

    request.get('/api/plugins').then((res) => {
      console.log(res)
      return Promise.map(res.body, (plugin) => {
        return request.get(APP_PROXY + plugin.name + '/discover').promise()
        .catch(() => {
          toastr.error('Could not discover for ' + plugin.name)
          return Promise.resolve() // continue discovering
        })
      })
      .then(() => toastr.info('Scan has finished'))
      .finally(() => toastr.dismiss(loader))
    })
  }

  render () {
    return (
      <span className='refresh-pod clickable' title='Rediscover all devices...'>
        <i className='fa fa-refresh' onClick={this.refresh.bind(this)} />
      </span>
    )
  }
}
