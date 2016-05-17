import React from 'react'

export default class VersionPod extends React.Component {
  constructor () {
    super()
    this.state = { showHistory: false}
  }

  toggleHistory () {
    this.setState({ showHistory: !this.state.showHistory })
    window.toggleHistory()
  }

  render () {
    return (
      <div className='notifications-pod clickable' onClick={this.toggleHistory.bind(this)}>
        { (!this.state.showHistory)
          ? <span><i className='fa fa-bell'/> 
              <span className='notifications-pod__text'> Notifications </span>
            </span>
          : (
            <span>
              <span className='notifications-pod__close'>
                <i className='fa fa-close' /> <span className='notifications-pod__close__text'> Close log </span>
              </span>
              &nbsp;|&nbsp;
              <span className='notifications-pod__clear'>
                <i onClick={window.clearHistory} className='fa fa-bell-slash'/> <span className='notifications-pod__clear__text'> Clear </span>
              </span>
            </span>
          )
        }
      </div>
    )
  }
}