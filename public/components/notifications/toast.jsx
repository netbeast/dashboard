import React from 'react'

export default class Toast extends React.Component {
  constructor (props) {
    super(props)
    this.close = this.close.bind(this)
  }

  close () { 
    if (typeof (this.props.dismiss) === 'function') {
      this.props.dismiss(this.props.id)
    }
  }

  render () {
    const { title, body, emphasis, timeout, isCurrent } = this.props // eslint-disable-line

    if (timeout) setTimeout(this.close, timeout)

    return (
      <div className={'alert alert-' + (emphasis) + (isCurrent ? ' current' : '')}>
        <span className='title'> {title || 'dashboard'} </span>
        { typeof this.props.dismiss === 'function'
          ? <button type='button' className='close' onClick={this.close}>×</button>
          : null}
        <br/>
        <div className='body'>
          {body}
        </div>
      </div>
    )
  }
}
