/* global toastr */
import React from 'react'
import mqtt from 'mqtt'
import request from 'superagent-bluebird-promise'
import { OverlayTrigger, Popover } from 'react-bootstrap'

import Pulse from '../misc/activity-pulse.jsx'
import { Session } from '../lib'

export default class App extends React.Component {
  constructor (props, context) {
    super(props)
    this.state = { isRunning: false, inactive: false, menuHidden: true }
    this.router = context.router
  }

  handleClick () {
    const { type } = this.props
    if (type !== 'explore') this.launch()
  }

  toggleMenu (event) {
    if (event) event.preventDefault() && event.stopPropagation()

    const { menuHidden } = this.state
    if (menuHidden) this.refs.contextMenu.show()
    else this.refs.contextMenu.hide()
    this.setState({ menuHidden: !menuHidden })
  }

  launch () {
    const { name } = this.props

    request.post('/api/activities/' + name).then(() => {
      return request.get('/live/' + name).promise()
    }).then(() => {
      this.router.push('/live/' + name)
    }).catch((err) => {
      if (err.status === 404) {
        this.setState({ isRunning: true })
        return toastr.info(`${name} is running`)
      }
      if (err.res) toastr.error(err.res.text)
      else toastr.error(err.message)
    })
  }

  install () {
    const url = this.props.git_url

    const loader = toastr.info(
      <span>
        <div className='loader'></div>
        Installing app...
      </span>
    )

    request.post('/api/apps').send({ url }).then((res) => {
      const name = res.body.name
      const props = res.body.netbeast
      const type = props ? props.type : 'app'

      toastr.success(`${name} has been installed!`)
      toastr.dismiss(loader)

      if (type === 'plugin' || type === 'service' || props.bootOnLoad)
      return request.post('/api/activities/' + name).promise()
    }).then((res) => { toastr.success(`${res.body.name} is running`) })
    .catch((fail, res) => toastr.error(res.text))
  }

  stop () {
    const { name, kind, dismiss } = this.props
    request.del('/api/activities/' + name).end((err, res) => {
      if (err) return

      this.setState({ isRunning: false })
      toastr.info(name + ' has been stopped.')
      if (kind !== 'apps' && kind !== 'plugins') dismiss(name)
    })
  }

  uninstall () {
    const { name, kind, dismiss } = this.props
    if (confirm('Do you really want to remove', name, '?'))
    request.del('/api/apps/' + name).end((err, res) => {
      if (err) return
      dismiss(name)
      toastr.info(name + ' has been removed.')
    })
  }

  contextMenu () {
    const { name, netbeast } = this.props
    const settings = netbeast && netbeast.settings
    return (
      <Popover id={name} className='context-menu'>
      <a href='javascript:void(0)' onClick={this.stop.bind(this)} className='stop btn btn-filled btn-warning'> Stop </a>
      <a href='javascript:void(0)' onClick={this.uninstall.bind(this)} className='remove btn btn-filled btn-primary'> Remove </a>
      {settings ? <a onClick={this.router.push.bind(this, '/i/' + name + ((settings === true && typeof settings === 'boolean') ? '/settings' : settings))} className='settings btn btn-filled btn-success'> Settings </a> : null}
      </Popover>
    )
  }

renderButton () {
    const { kind, git_url } = this.props
    switch (kind) {
      case 'activities':
        return <a href='javascript:void(0)' onClick={this.stop.bind(this)} className='stop btn btn-filled btn-warning'> Stop </a>
      case 'remove':
        return <a href='javascript:void(0)' onClick={this.uninstall.bind(this)} className='remove btn btn-filled btn-primary'> Remove </a>
      case 'explore':
        return <a href='javascript:void(0)' onClick={API.install.bind(API, git_url)} className='install btn btn-filled btn-info'> Install </a>
    }
  }

  componentDidMount () {
    const { name, netbeast } = this.props
    this.mqtt = mqtt.connect(window.mqttUri)
    this.mqtt.subscribe('netbeast/activities/close')
    this.mqtt.on('message', (topic, message) => {
      if (message.toString() === name) this.setState({ isRunning: false })
    })

    request.get('/api/activities/' + name).end((err, res) => {
      if (!err) this.setState({ isRunning: true })
    })

    if (netbeast && (netbeast.type === 'plugin')) {
      const devices = Session.load('devices') || []
      const found = devices.find((d) => { return d.app === name })
      this.setState({ inactive: !found })
    }
  }

  componentWillUnmount () {
    this.mqtt.end()
  }

  render () {
    const { name, author, logo, netbeast } = this.props
    const isPlugin = netbeast && (netbeast.type === 'plugin')
    const defaultLogo = isPlugin ? 'url(/img/plugin.png)' : 'url(/img/dflt.png)'
    const logoStyle = { backgroundImage: logo ? `url(/api/apps/${name}/logo)` : defaultLogo }

    const { inactive, isRunning } = this.state
    const inactiveClass = inactive && isRunning ? ' warning' : ''

    return (
      <div className={'app' + inactiveClass}>
      {(isRunning) ? <Pulse {...this.props} /> : null}
      <OverlayTrigger ref='contextMenu' trigger={[]} rootClose placement='bottom' overlay={this.contextMenu()}>
        <div className='logo' title='Launch app' style={logoStyle} onClick={this.handleClick.bind(this)} onContextMenu={this.toggleMenu.bind(this)} />
      </OverlayTrigger>
      {this.renderButton()}
      <h4 className='name'>{name}</h4>
      </div>
    )
  }
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
}
