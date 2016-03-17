import React from 'react'
import { Link } from 'react-router'
import Avatar from 'react-avatar'
import { OverlayTrigger, Popover } from 'react-bootstrap'

import { Session } from '../lib'

export default class UserPod extends React.Component {
  constructor () {
    super()
    this.state = { user: Session.load('user') }
  }

  logOut () {
    Session.delete('user')
    this.setState({ user: null })
  }

  render () {
    const { user } = this.state
    const { alias, email, src } = user ? user : { alias: 'Guest' }

    const popover = (
      <Popover id='user-pod'>
        <ul className='list-unstyled'>
          { user ? <li onClick={this.logOut.bind(this)}><i className='fa fa-sign-out'/>Log out</li>
          : <li><Link to='/login'><i className='fa fa-sign-in'/> Log in</Link></li> }
        </ul>
      </Popover>
    )

    return (
      <div className='user-pod'>
        <span className='user-pod-avatar'>
          <Avatar round={true} name={alias} src={src} size={32} />
        </span>
        <OverlayTrigger trigger={['click']} rootClose placement='bottom' overlay={popover}>
          <span className='user-pod-name'> {alias} <i className='fa fa-caret-down'></i></span>
        </OverlayTrigger>
      </div>
    )
  }
}
