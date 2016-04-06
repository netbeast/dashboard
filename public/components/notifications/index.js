import React from 'react'
import mqtt from 'mqtt'

import Toast from './toast.jsx'
import { Session } from '../lib'

let idx = 0

export default class Notifications extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      toasts: [],
      history: Session.load('notifications') || [],
      showHistory: false
    }
    this.dismiss = this.dismiss.bind(this)
    this.toggleHistory = this.toggleHistory.bind(this)
  }

  notify (notification) {
    const id = idx++
    const timeout = notification.timeout || 4700
    const toast = Object.assign({ id, timeout }, notification)
    const history = Session.load('notifications') || []
    Session.save('notifications', [...history, toast])
    this.setState({
      history: [...history, toast],
      toasts: [...this.state.toasts, toast]
    })
    return id
  }

  handleNotification (topic, message) {
    // console.log('mqtt://push ->', message.toString())
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

  toggleHistory () { 
    console.log('toggle history')
    this.setState({ showHistory: !this.state.showHistory }) }

  componentDidMount () {
    this.mqtt = mqtt.connect(window.mqttUri)
    this.mqtt.subscribe('netbeast/push')
    this.mqtt.on('message', this.handleNotification.bind(this))

    window.notify = this.notify.bind(this) // make it globally accesible
    window.toastr = {
      info: (body, title) => {
        return window.notify({title: title, body: body, emphasis: 'info'})
      },
      error: (body, title) => {
        return window.notify({title: title, body: body, emphasis: 'error'})
      },
      success: (body, title) => {
        return window.notify({title: title, body: body, emphasis: 'success'})
      },
      warning: (body, title) => {
        return window.notify({title: title, body: body, emphasis: 'warning'})
      },
      dismiss: this.dismiss.bind(this)
    }
  }

  componentWillUnmount () {
    this.mqtt.end(() => console.log('Client disconnected'))
  }

  render () {
    const { toasts, history, showHistory } = this.state

    return (
      <span>
        <div className='notifications-pod clickable' onClick={this.toggleHistory}>
          <i className='fa fa-bell'> </i> Notifications
        </div>
        <div className='notifications z-super'>
          { showHistory ? history.map((props, index) => {
            const isCurrent = index === (toasts.length - 1)
            return <Toast isCurrent={isCurrent} key={props.id} {...props} />
          }) : toasts.map((props, index) => {
            const isCurrent = index === (toasts.length - 1)
            return <Toast isCurrent={isCurrent} key={props.id} {...props} dismiss={this.dismiss.bind(this)}/>
          })}
        </div>
      </span>
    )
  }
}
