import React from 'react'

export default class Toast extends React.Component {
  constructor (props) {
    super(props)
    this.close = this.close.bind(this)
  }

  close () { this.props.dismiss(this.props.id) }

  render () {
    const {title, body, emphasis, timeout} = this.props

    // if (timeout) setTimeout(this.close, timeout)

    return (
      <div className={'toast ' + emphasis}>
        <span className='title'> {title || 'dashboard'} </span>
        <div className='close' onClick={this.close}> &#x2715; </div>
        <br/>
        <div className='body'>
          {body.toString()}
        </div>
      </div>
    )
  }
}
