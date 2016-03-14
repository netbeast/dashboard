/* global toastr */
import React from 'react'
import mqtt from 'mqtt'
import request from 'superagent-bluebird-promise'
import { OverlayTrigger, Popover } from 'react-bootstrap'

import Pulse from '../misc/activity-pulse.jsx'

export default class App extends React.Component {
  constructor (props, context) {
    super(props)
    this.state = { isRunning: false, menuHidden: true }
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
      return request.get('/i/' + name).promise()
    }).then(() => {
      this.router.push('/i/' + name)
    }).catch((err) => {
      if (err.status === 404) {
        this.setState({ isRunning: true })
        return toastr.info(`${name} is running`)
      }
      toastr.error(err.message)
    })
  }

  install () {
    const url = this.props.git_url

    request.post('/api/apps').send({ url }).then((res) => {
      const name = res.body.name
      const props = res.body.netbeast
      const type = props ? props.type : 'app'

      toastr.success(`${name} has been installed!`)

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
    request.del('/api/apps/' + name).end((err, res) => {
      if (err) return
      dismiss(name)
      toastr.info(name + ' has been removed.')
    })
  }

  contextMenu () {
    const { name } = this.props
    return (
      <Popover id={name} className='context-menu'>
      <a href='javascript:void(0)' onClick={this.stop.bind(this)} className='stop btn btn-filled btn-warning'> Stop </a>
      <a href='javascript:void(0)' onClick={this.uninstall.bind(this)} className='remove btn btn-filled btn-primary'> Remove </a>
      </Popover>
    )
  }

  renderStopButton () {
    const { kind } = this.props
    return kind === 'activities'
    ? <a href='javascript:void(0)' onClick={this.stop.bind(this)} className='stop btn btn-filled btn-warning'> Stop </a>
    : null
  }

  renderRemoveButton () {
    const { kind } = this.props
    console.log(kind)
    return kind === 'remove'
    ? <a href='javascript:void(0)' onClick={this.uninstall.bind(this)} className='remove btn btn-filled btn-primary'> Remove </a>
    : null
  }

  renderInstallButton () {
    const { kind } = this.props
    return kind === 'explore'
    ? <a href='javascript:void(0)' onClick={this.install.bind(this)} className='install btn btn-filled btn-info'> Install </a>
    : null
  }

  componentDidMount () {
    const { name } = this.props
    this.mqtt = mqtt.connect()
    this.mqtt.subscribe('netbeast/activities/close')
    this.mqtt.on('message', (topic, message) => {
      if (message.toString() === name) this.setState({ isRunning: false })
    })

    request.get('/api/activities/' + name).end((err, res) => {
      if (!err) this.setState({ isRunning: true })
    })
  }

  componentWillUnmount () {
    this.mqtt.end()
  }

  render () {
    const { name, author, logo, netbeast } = this.props
    const isPlugin = netbeast && (netbeast.type === 'plugin')
    const defaultLogo = isPlugin ? 'url(/img/plugin.png)' : 'url(/img/dflt.png)'
    const logoStyle = { backgroundImage: logo ? `url(/api/apps/${name}/logo)` : defaultLogo }

    return (
      <div className='app'>
      {this.state.isRunning ? <Pulse {...this.props} /> : null}
      <OverlayTrigger ref='contextMenu' trigger={[]} rootClose placement='bottom' overlay={this.contextMenu()}>
      <div className='logo' title='Launch app' style={logoStyle} onClick={this.handleClick.bind(this)} onContextMenu={this.toggleMenu.bind(this)} />
      </OverlayTrigger>
      {this.renderStopButton()}
      {this.renderRemoveButton()}
      {this.renderInstallButton()}
      <h4 className='name'>{name}</h4>
      </div>
    )
  }
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
}
