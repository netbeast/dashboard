import React from 'react'

export default class Toast extends React.Component {
  constructor (props) {
    super(props)
    this.close = this.close.bind(this)
  }

  close () { this.props.dismiss(this.props.id) }

  render () {
    const { title, body, emphasis, timeout, isCurrent } = this.props // eslint-disable-line

    // if (timeout) setTimeout(this.close, timeout)

    return (
      <div className={'alert alert-' + (emphasis) + (isCurrent ? ' current' : '')}>
        <span className='title'> {title || 'dashboard'} </span>
        <button type='button' className='close' onClick={this.close}>×</button>
        <br/>
        <div className='body'>
          {body.toString()}
        </div>
      </div>
    )
  }
}
