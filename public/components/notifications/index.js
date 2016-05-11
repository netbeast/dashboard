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
      history: Session.load('history') || [],
      showHistory: false
    }
    this.dismiss = this.dismiss.bind(this)
    this.toggleHistory = this.toggleHistory.bind(this)
    window.clearHistory = this.clearHistory = this.clearHistory.bind(this)
  }

  notify (notification) {
    const id = new Date().getTime() + idx++
    const timeout = notification.timeout || 4700
    const toast = Object.assign({ id, timeout }, notification)
    this.storeNotifications(toast)
    this.setState({ toasts: [...this.state.toasts, toast] })
    return id
  }

  handleNotification (topic, message) {
    // console.log('mqtt://push ->', message.toString())
    const notification = JSON.parse(message.toString())
    this.notify(notification)
  }

  storeNotifications (notification) {
    const { body } = notification
    if (React.isValidElement(body) || typeof body !== 'string') return

    const history = Session.load('history') || []
    Session.save('history', [...history, notification])
    this.setState({ history: [...history, notification] })
  }

  dismiss (toastId) {
    let toasts = [ ...this.state.toasts ] // copy array, not reference
    const index = toasts.findIndex((toast) => { return toast.id === toastId })
    if (index < 0) return // do not change react component
    toasts.splice(index, 1) // splice changes the array
    this.setState({ toasts: toasts })
  }

  toggleHistory () {
    // console.log('toggle history', this.state.history)
    this.setState({ showHistory: !this.state.showHistory })
  }

  clearHistory () {
    Session.remove('history')
    this.setState({ history: [], showHistory: !this.state.showHistory })
  }

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
          { (!showHistory)
            ? <span><i className='fa fa-bell'/> Notifications</span>
            : (
              <span>
                <i className='fa fa-close'/> Close log
                <span onClick={this.clearHistory}> | <i className='fa fa-bell-slash'/> Clear </span>
              </span>
            )
          }
        </div>
        <div className='notifications z-super'>
          { showHistory ? history.map((data, index) => {
            const isCurrent = index === (toasts.length - 1)
            return <Toast isCurrent={isCurrent} key={'history-' + data.id} {...data} />
          }) : toasts.map((data, index) => {
            const isCurrent = index === (toasts.length - 1)
            return <Toast isCurrent={isCurrent} key={data.id} {...data} dismiss={this.dismiss.bind(this)}/>
          })}
        </div>
      </span>
    )
  }
}
