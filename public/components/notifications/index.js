import React from 'react'
import mqtt from 'mqtt'

import Toast from './toast.jsx'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { toasts: [] }
    this.client = mqtt.connect()
    this.dismiss = this.dismiss.bind(this)
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

  dismiss (index, timeout) {
    const toasts = this.state.toasts.splice(index, 1)
    if (typeof timeout === 'undefined') {
      return this.setState({ toasts: toasts })
    } else {
      setTimeout(this.dismiss, timeout)
    }
  }

  componentDidMount () {
    this.client.subscribe('netbeast/push')
    this.client.on('message', this.handleNotification.bind(this))

    window.notify = this.notify.bind(this) // make it globally accesible
    window.toastr = {
      info: (body, title = 'dashboard') => {
        window.notify({title: title, body: body, emphasis: 'info'})
      },
      error: (body, title = 'dashboard') => {
        window.notify({title: title, body: body, emphasis: 'error'})
      },
      success: (body, title = 'dashboard') => {
        window.notify({title: title, body: body, emphasis: 'success'})
      },
      warning: (body, title = 'dashboard') => {
        window.notify({title: title, body: body, emphasis: 'warning'})
      }
    }
  }

  componentWillUnmount () {
    this.client.end(() => console.log('Client disconnected'))
  }

  render () {
    const { toasts } = this.state
    return (
      <div className='notifications'>
        {toasts.map((props, index) => {
          return <Toast {...props} dismiss={this.dismiss.bind(this, index)}/>
        })}
      </div>
    )
  }
}
