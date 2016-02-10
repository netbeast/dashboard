import React from 'react'

export default class Toast extends React.Component {
  constructor (props) {
    super(props)
    this.close = this.close.bind(this)
  }

  close () { this.props.dismiss(this.props.id) }

  render () {
    const { title, body, emphasis, timeout } = this.props // eslint-disable-line

    if (timeout) setTimeout(this.close, timeout)

    return (
      <div className={'alert alert-' + (emphasis || 'info') }>
        <span className='title'> {title || 'dashboard'} </span>
        <button type='button' className='close' onClick={this.close} data-dismiss='alert'>×</button>
        <br/>
        <div className='body'>
          {body.toString()}
        </div>
      </div>
    )
  }
}

Toast.propTypes = {
  id: React.PropTypes.String,
  dismiss: React.PropTypes.function
}
