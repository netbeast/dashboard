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
    const { title, body, emphasis } = notification
    const id = `${title}.${body}.${emphasis}.${(new Date()).getTime()}`
    const timeout = notification.timeout || 2700
    const toast = Object.assign({ id, timeout }, notification)
    this.setState({ toasts: [toast, ...this.state.toasts] })
  }

  handleNotification (topic, message) {
    console.log('mqtt://push ->', message.toString())
    const notification = JSON.parse(message.toString())
    this.notify(notification)
  }

  dismiss (toastId) {
    let toasts = [ ...this.state.toasts ] // copy array, not reference
    const index = toasts.findIndex((toast) => { return toast.id === toastId })
    if (index < 0) return // do not change react component
    toasts.splice(index, 1) // splice changes the array
    this.setState({ toasts: toasts })
  }

  componentDidMount () {
    this.client.subscribe('netbeast/push')
    this.client.on('message', this.handleNotification.bind(this))

    window.notify = this.notify.bind(this) // make it globally accesible
    window.toastr = {
      info: (body, title) => {
        window.notify({title: title, body: body, emphasis: 'info'})
      },
      error: (body, title) => {
        window.notify({title: title, body: body, emphasis: 'error'})
      },
      success: (body, title) => {
        window.notify({title: title, body: body, emphasis: 'success'})
      },
      warning: (body, title) => {
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
      <div className='notifications z-super'>
        {toasts.map((props) => {
          return <Toast key={props.id} {...props} dismiss={this.dismiss.bind(this)}/>
        })}
      </div>
    )
  }
}
