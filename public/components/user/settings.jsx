/* global toastr */

import React from 'react'
import { Col } from 'react-bootstrap'
import request from 'superagent-bluebird-promise'
import Promise from 'bluebird'

import { Session } from '../lib'

const API_PATH = process.env.API_URL + '/api'

export default class Settings extends React.Component {
  constructor (props, context) {
    super(props)
    this.router = context.router
    this.state = { user: Session.load('user') }
    this.updateSettings = this.updateSettings.bind(this)
    this.deleteAccount = this.deleteAccount.bind(this)
  }

  grabValidFormData () {
    const { alias, email, password, password_confirmation } = this.refs

    if (!alias.value || !email.value || !password.value) {
      toastr.warning('Ups! Seems like you forgot some fields')
      return false
    }

    if (password.value !== password_confirmation.value) {
      toastr.warning("Typed passwords aren't equal")
      return false
    }

    const { _id } = this.state.user
    return { id: _id, alias: alias.value, email: email.value, password: password.value }
  }

  updateSettings (event) {
    event.preventDefault()

    const user = this.grabValidFormData()
    if (!user) return

    const { token } = this.state.user

    request.put(API_PATH + '/users')
    .set({ 'Authorization': token })
    .send(user).then((resp) => {
      Session.save('user', resp.body)
      this.setState({ user: resp.body } )
      toastr.success('Your params have been updated')
    })
    .catch((err) => { toastr.error(err.res.text) })
  }

  deleteAccount () {
    const { _id, token } = this.state.user
    if (window.confirm('Are you sure you want to delete your account?')) {
      request.del(API_PATH + '/user/' + _id)
      .set({ 'Authorization': token })
      .end((err, resp) => {
        if (err) return toastr.error(err.message)

        Session.delete('user')
        this.router.push('/')
        toastr.info('Sorry to see you go :(')
      })
    }
  }

  render () {
    const { alias, email } = this.state.user

    return (
      <Col xs={10} xsOffset={1} sm={6} smOffset={3} md={4} mdOffset={4}>
      <br/>
      <br/>
      <br/>
        <h4>Update your profile.</h4>
        <form onSubmit={this.updateSettings}>
          <input ref='alias' type='text' placeholder='Choose a username' defaultValue={alias} className='form-control'></input>
          <br/>
          <input ref='email' type='email' placeholder='your@email.com' defaultValue={email} className='form-control'></input>
          <br/>
          <input ref='password' type='password' placeholder='Type a password' className='form-control'></input>
          <br/>
          <input ref='password_confirmation' type='password' placeholder='Retype your password' className='form-control'></input>
        <br/>
        <button type='submit' className='btn btn-info'>Update settings</button>&nbsp;
        </form>
        <br/>
        <p>
          Profile pic is grabbed from <a target='_blank' href='https://en.gravatar.com/'>gravatar</a> if there is an internet connection.
        </p>
        <br/>
        <br/>
        <a onClick={this.deleteAccount} href='javascript:void(0)' className='btn btn-xs btn-primary'>
          <i className='fa fa-exclamation-triangle'/> Delete your account
        </a>
      </Col>
    )
  }
}

Settings.contextTypes = {
  router: React.PropTypes.object.isRequired
}
