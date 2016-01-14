import React from 'react'
import { History } from 'react-router'
import jQuery from 'jquery'

export default React.createClass({

  mixins: [ History ],

  launchApp () {
    const { name } = this.props

    jQuery.ajax({
      url: '/activities/' + name,
      dataType: 'json',
      cache: false,

      method: 'POST',
      success: (data) => {
        this.history.pushState(null, '/i/' + name)
      }
    })
  },

  render () {
    const { name, author } = this.props
    const logo = `/apps/${name}/logo`
    return (
      <div className='app'>
        <div className='logo' onClick={this.launchApp}>
          <img className='filter-to-white' src={logo} alt={logo} />
        </div>
        <h4>
          <br/> <span className='name'>{name}</span>
          <br/> <span className='author'>{author}</span>
        </h4>
      </div>
    )
  }
})
