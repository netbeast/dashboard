/* global toastr */
import React from 'react'
import request from 'superagent'

export default class App extends React.Component {
  constructor (props, context) {
    super(props)
    this.router = context.router
  }

  handleClick () {
    const { type } = this.props
    console.log(this.props)
    if (type === 'apps') this.launch()
  }

  launch () {
    const { name } = this.props
    request.post('/api/activities/' + name).end((err, data) => {
      if (err) return toastr.error(err.message)
      this.router.push('/live/' + name)
    })
  }

  install () {
    const url = this.props.git_url
    request.post('/api/apps').send({ url }).end((err, res) => {
      if (err) return window.toastr.error(res.text)
      window.toastr.success(`${res.body.name} has been installed!`)
    })
  }

  stop () {
    const { name } = this.props
    request.del('/api/activities/' + name).end((err, res) => {
      if (err) return toastr.error(res.text)
      toastr.info(name + ' has been stopped.')
    })
  }

  uninstall () {
    const { name } = this.props
    request.del('/api/apps/' + name).end((err, res) => {
      if (err) return toastr.error(res.text)
      toastr.info(name + ' has been removed.')
    })
  }

  renderStopButton () {
    const { type } = this.props
    return type === 'activities'
    ? <a href='#' onClick={this.stop.bind(this)} className='stop btn btn-filled btn-warning'> Stop </a>
    : null
  }

  renderRemoveButton () {
    const { type } = this.props
    return type === 'uninstall'
    ? <a href='#' onClick={this.uninstall.bind(this)} className='remove btn btn-filled btn-danger'> Remove </a>
    : null
  }

  renderInstallButton () {
    const { type } = this.props
    return type === 'explore'
    ? <a href='#' onClick={this.install.bind(this)} className='install btn btn-filled btn-info'> Install </a>
    : null
  }

  render () {
    const { name, author } = this.props
    const logo = `/api/apps/${name}/logo`
    return (
      <div className='app'>
        <div className='logo' title='Launch app' onClick={this.handleClick.bind(this)}>
          <img className='filter-to-white' src={logo} alt={logo} />
        </div>
        {this.renderStopButton()}
        {this.renderRemoveButton()}
        {this.renderInstallButton()}
        <h4>
          <br/> <span className='name'>{name}</span>
        </h4>
        <span className='author'>{author}</span>
      </div>
    )
  }
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
}
