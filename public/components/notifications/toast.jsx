import React from 'react'

export default class Toast extends React.Component {
  constructor (props) {
    super(props)
    this.state = { visible: true }
  }

  render () {
    const {title, body, emphasis, timeout, dismiss} = this.props

    if (timeout) dismiss(timeout)

    return this.state.visible ? (
      <div className={'toast ' + emphasis}>
        <span className='title'> {title} </span>
        <div className='close' onClick={dismiss}> &#x2715; </div>
        <br/>
        <div className='body'>
          {body || this.props.children}
        </div>
      </div>
    ) : <span />
  }
}
