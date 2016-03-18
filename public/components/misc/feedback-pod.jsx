import React from 'react'
import request from 'superagent'
// var React = require('react')

export default class ConnectionPod extends React.Component {
  constructor () {
    super()
  }

  render () {
    return (
      <a href='https://github.com/netbeast/dashboard/issues' target='_blank' className='feedback-pod' title='Give us feedback'>Feedback</a>
    )
  } 
}
