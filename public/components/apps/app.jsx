/* global toastr */
import React from 'react'
import { History } from 'react-router'
import request from 'superagent'

export default React.createClass({

  mixins: [ History ],

  launch () {
    const { name } = this.props
    request.post('/api/activities/' + name)
    .end((err, data) => {
      if (err) return toastr.error(err.message)
      this.history.pushState(null, '/i/' + name)
    })
  },

  stop () {
    const { name } = this.props
    request.del('/api/activities/' + name)
    .end((err, data) => {
      if (err) return toastr.error(err.message)
      toastr.info(name + ' has been stopped.')
    })
  },

  renderStop () {
    const { type } = this.props
    return type === 'activities'
    ? <a href='#' onClick={this.stop} className='stop-btn'> Stop </a>
    : null
  },

  render () {
    const { name, author } = this.props
    const logo = `/api/apps/${name}/logo`
    return (
      <div className='app'>
        <div className='logo' onClick={this.launch}>
          <img className='filter-to-white' src={logo} alt={logo} />
          {this.renderStop()}
        </div>
        <h4>
          <br/> <span className='name'>{name}</span>
        </h4>
        <span className='author'>{author}</span>
      </div>
    )
  }
})
