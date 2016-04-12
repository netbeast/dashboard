import React from 'react'
import { Link } from 'react-router'
import Avatar from 'react-avatar'
import { OverlayTrigger, Popover } from 'react-bootstrap'

import { Session } from '../lib'

export default class UserPod extends React.Component {
  constructor () {
    super()
    this.state = { user: Session.load('user') }
    this.popover = this.popover.bind(this)
    this.logOut = this.logOut.bind(this)
  }

  logOut () {
    Session.delete('user')
    this.setState({ user: null })
  }

  popover () {
    const { user } = this.state

    const logged = (
      <ul className='list-unstyled'>
        <li><Link to='/settings'><i className='fa fa-gear'/> Settings</Link></li>
        <li onClick={this.logOut}><i className='fa fa-sign-out'/>Log out</li>
      </ul>
    )

    const unlogged = (
      <ul className='list-unstyled'>
        <li><Link to='/login'>Log in</Link> or <Link to='/signup'>Sign up</Link></li>
      </ul>
    )

    return (
      <Popover id='user-pod'>
          { user ? logged : unlogged }
      </Popover>
    )
  }

  render () {
    const { user } = this.state
    const { alias, email, src } = user ? user : { alias: 'Guest' }

    return (
      <div className='user-pod clickable'>
        <span className='user-pod-avatar'>
          <Avatar round={true} name={alias} src={src} size={32} />
        </span>
        <OverlayTrigger trigger={['click']} rootClose placement='bottom' overlay={this.popover()}>
          <span className='user-pod-name'> {alias} <i className='fa fa-caret-down'></i></span>
        </OverlayTrigger>
      </div>
    )
  }
}
