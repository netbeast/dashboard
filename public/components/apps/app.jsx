/* global toastr */
import React from 'react'
import request from 'superagent'

export default class App extends React.Component {
  constructor (props, context) {
    super(props)
    this.router = context.router
  }

  launch () {
    const { name } = this.props
    request.post('/api/activities/' + name)
    .end((err, data) => {
      if (err) return toastr.error(err.message)
      this.router.push('/i/' + name)
    })
  }

  stop () {
    const { name } = this.props
    request.del('/api/activities/' + name)
    .end((err, data) => {
      if (err) return toastr.error(err.message)
      toastr.info(name + ' has been stopped.')
    })
  }

  renderStop () {
    const { type } = this.props
    return type === 'activities'
    ? <a href='#' onClick={this.stop.bind(this)} className='stop-btn'> Stop </a>
    : null
  }

  render () {
    const { name, author } = this.props
    const logo = `/api/apps/${name}/logo`
    return (
      <div className='app'>
        <div className='logo' onClick={this.launch.bind(this)}>
          <img className='filter-to-white' src={logo} alt={logo} />
        </div>
        {this.renderStop()}
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
