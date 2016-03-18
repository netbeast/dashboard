import React from 'react'
import request from 'superagent'
// var React = require('react')

export default class ConnectionPod extends React.Component {
  constructor () {
    super()
    this.state = { connected: '' }
  }

  componentDidMount () {
    this.ping()
    setInterval(() => {
      this.ping()
    }, 10000)
  }

  ping () {
    request.get('https://api.github.com/search/repositories?q=netbeast+language:javascript')
    .end((err, resp)  => {
      if(err) return this.setState({connected: false})
      this.setState({connected: true})
    })
  }

  render () {
    const className = 'connection-pod ' + (this.state.connected ? 'green' : 'red')
    const title = this.state.connected ? 'You have internet connection' : 'Check your internet connection'

    return (
      <span className={className} title={title}>
      </span>
    )
  } 
}
