import React from 'react'
import { History } from 'react-router'
import jQuery from 'jquery'

export default React.createClass({

  mixins: [ History ],

  launchApp () {
    const { name } = this.props

    jQuery.ajax({
      url: '/api/activities/' + name,
      dataType: 'json',
      cache: false,

      method: 'POST',
      success: (data) => {
        this.history.pushState(null, '/i/' + name)
      }
    })
  },

  renderStop () {
    const { type } = this.props
    return type === 'activities'
    ? <a href='#' className='stop-btn'> Stop </a>
    : null
  },

  render () {
    const { name, author } = this.props
    const logo = `/api/apps/${name}/logo`
    return (
      <div className='app'>
        <div className='logo' onClick={this.launchApp}>
          <img className='filter-to-white' src={logo} alt={logo} />
        </div>
        <h4>
          <br/> <span className='name'>{name}</span>
          <br/> <span className='author'>{author}</span>
        </h4>
        {this.renderStop()}
      </div>
    )
  }
})
