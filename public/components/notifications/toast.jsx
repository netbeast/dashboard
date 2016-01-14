import React from 'react'

export default class Toast extends React.Component {
  constructor (props) {
    super(props)
    this.state = { visible: true }
    this.dismiss = this.dismiss.bind(this)
  }

  dismiss (timeout) {
    if (typeof timeout === 'undefined') {
      return this.setState({ visible: false })
    } else {
      setTimeout(this.dismiss, timeout)
    }
  }

  render () {
    const {title, body, emphasis, timeout} = this.props
    if (timeout) this.dismiss(timeout)
    return this.state.visible ? (
      <div className={'toast ' + emphasis}>
        <span className='title'> {title} </span>
        <div className='close' onClick={this.dismiss}> &#x2715; </div>
        <br/>
        <div className='body'>
          {body || this.props.children}
        </div>
      </div>
    ) : <span />
  }
}
