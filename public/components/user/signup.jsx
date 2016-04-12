/* global toastr */

import React from 'react'
import { Link } from 'react-router'
import { Col } from 'react-bootstrap'
import request from 'superagent-bluebird-promise'
import Promise from 'bluebird'

import { Session } from '../lib'

const API_PATH = process.env.API_URL + '/api'

export default class Signup extends React.Component {
  constructor (props, context) {
    super(props)
    this.router = context.router
  }

  grabValidFormData () {
    const { alias, email, password, password_confirmation } = this.refs

    if (!alias.value || !email.value || !password.value) {
      toastr.warning('Ups! Seems like you forgot some fields')
      return false
    }

    if (password.value !== password_confirmation.value) {
      toastr.warning("Typed passwords aren't equal")
      return false
    }

    return { alias: alias.value, email: email.value, password: password.value }
  }

  handleSubmit (event) {
    event.preventDefault()

    const user = this.grabValidFormData()
    if (!user) return

    request.post(API_PATH + '/users').send(user).then((resp) => {
      return request.post(API_PATH + '/login').send(user).then((resp) => {
        Session.save('user', resp.body)
        this.router.push('/')
        return Promise.resolve()
      })
    })
    .catch((err) => toastr.error(err.message))
  }

  render () {
    return (
      <Col xs={10} xsOffset={1} sm={6} smOffset={3} md={4} mdOffset={4}>
      <br/>
      <br/>
      <br/>
        <h4>Sing up.</h4>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input ref='alias' type='text' placeholder='Choose a username' className='form-control'></input>
          <br/>
          <input ref='email' type='email' placeholder='your@email.com' className='form-control'></input>
          <br/>
          <input ref='password' type='password' placeholder='Type a password' className='form-control'></input>
          <br/>
          <input ref='password_confirmation' type='password' placeholder='Retype your password' className='form-control'></input>
        <br/>
        <button type='submit' className='btn btn-info'>Sign up</button>
        </form>
        <br/>
        <span>
          Do you already have an account? <Link to='/signup'>Sign up</Link>.
          <br/>
          <small>Check out our terms and services.</small>
        </span>
      </Col>
    )
  }
}

Signup.contextTypes = {
  router: React.PropTypes.object.isRequired
}
