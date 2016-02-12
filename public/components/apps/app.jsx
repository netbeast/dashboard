/* global toastr */
import React from 'react'
import request from 'superagent-bluebird-promise'

export default class App extends React.Component {
  constructor (props, context) {
    super(props)
    this.router = context.router
    this.state = { hidden: false }
  }

  handleClick () {
    const { type } = this.props
    console.log(this.props)
    if (type !== 'explore') this.launch()
  }

  launch () {
    const { name } = this.props
    request.post('/api/activities/' + name).then(() => {
      return request.get('/i/' + name).promise()
    }).then(() => {
      this.router.push('/live/' + name)
    }).catch((err) => {
      if (err.status === 404) return toastr.info(`${name} is running`)
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
    const { name } = this.props
    request.del('/api/activities/' + name).end((err, res) => {
      if (err) return toastr.error(res.text)
      this.setState({ hidden: true })
      toastr.info(name + ' has been stopped.')
    })
  }

  uninstall () {
    const { name } = this.props
    request.del('/api/apps/' + name).end((err, res) => {
      if (err) return toastr.error(res.text)
      this.setState({ hidden: true })
      toastr.info(name + ' has been removed.')
    })
  }

  renderStopButton () {
    const { type } = this.props
    return type === 'activities'
    ? <a href='javascript:void(0)' onClick={this.stop.bind(this)} className='stop btn btn-filled btn-warning'> Stop </a>
    : null
  }

  renderRemoveButton () {
    const { type } = this.props
    return type === 'uninstall'
    ? <a href='javascript:void(0)' onClick={this.uninstall.bind(this)} className='remove btn btn-filled btn-primary'> Remove </a>
    : null
  }

  renderInstallButton () {
    const { type } = this.props
    return type === 'explore'
    ? <a href='javascript:void(0)' onClick={this.install.bind(this)} className='install btn btn-filled btn-info'> Install </a>
    : null
  }

  render () {
    if (this.state.hidden) return null

    const { name, author, logo, netbeast } = this.props
    const isPlugin = netbeast && (netbeast.type === 'plugin')
    const defaultLogo = isPlugin ? 'url(/img/plugin.png)' : 'url(/img/dflt.png)'
    const logoStyle = { backgroundImage: logo ? `url(/api/apps/${name}/logo)` : defaultLogo }

    return (
      <div className='app'>
        <div className='logo' title='Launch app' style={logoStyle}
        onClick={this.handleClick.bind(this)}>
        </div>
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
