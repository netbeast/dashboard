import React from 'react'
import mqtt from 'mqtt'

import Toast from './toast.jsx'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { toasts: [] }
    this.client = mqtt.connect()
  }

  notify (notification) {
    const toast = Object.assign({ timeout: 2700 }, notification)
    this.setState({ toasts: [toast, ...this.state.toasts] })
  }

  handleNotification (topic, message) {
    console.log('mqtt://push ->', message.toString())
    const notification = JSON.parse(message.toString())
    this.notify(notification)
  }

  componentDidMount () {
    this.client.subscribe('netbeast/push')
    this.client.on('message', this.handleNotification.bind(this))

    window.notify = this.notify.bind(this) // make it globally accesible
  }

  componentWillUnmount () {
    // this.client.end(() => console.log('Client disconnected'))
  }

  render () {
    const { toasts } = this.state
    return (
      <div className='notifications'>
        {toasts.map(function (props) {
          return <Toast {...props} />
        })}
      </div>
    )
  }
}
