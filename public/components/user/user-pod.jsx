import React from 'react'
import { Link } from 'react-router'
import Avatar from 'react-avatar'
import { OverlayTrigger, Popover } from 'react-bootstrap'

import { Session } from '../lib'

export default class UserPod extends React.Component {
  constructor (props, context) {
    super(props)
    this.state = { user: Session.load('user') }
    this.popover = this.popover.bind(this)
    this.router = context.router

    /* Methods */
    window.logOut = this.logOut = this.logOut.bind(this)
    window.logIn = this.logIn = this.logIn.bind(this)
  }

  logIn (user) {
    Session.save('user', user)
    this.setState({ user })
    if (window.location.state && window.location.state.nextPathname) {
      this.router.replace(window.location.state.nextPathname)
    } else {
      this.router.replace('/')
    }
  }

  logOut () {
    Session.delete('user')
    this.setState({ user: null })
    return this.router.push('/')
  }

  popover () {
    const { user } = this.state

    const logged = (
      <ul className='user-pod__menu list-unstyled'>
        <li><Link to='/settings'><i className='fa fa-gear'/> Settings</Link></li>
        <li onClick={this.logOut}><i className='fa fa-sign-out'/>Log out</li>
      </ul>
    )

    const unlogged = (
      <ul className='user-pod__menu list-unstyled'>
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
    const { alias, src } = user ? user : { alias: 'Guest' }

    return (
      <OverlayTrigger trigger={['click']} rootClose placement='bottom' overlay={this.popover()}>
        <div className='user-pod clickable'>
          <span className='user-pod__avatar'>
            <Avatar round={true} name={alias} src={src} size={32} />
          </span>
          <span className='user-pod__name'> {alias} <i className='fa fa-caret-down'></i></span>
        </div>
      </OverlayTrigger>
    )
  }
}

UserPod.contextTypes = {
  router: React.PropTypes.object.isRequired
}
