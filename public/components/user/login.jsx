/* global toastr */

import React from 'react'
import { Link } from 'react-router'
import { Col } from 'react-bootstrap'
import request from 'superagent'

import { Session } from '../lib'

const API_PATH = process.env.API_URL + '/api'

export default class Login extends React.Component {
  constructor (props, context) {
    super(props)
    this.router = context.router
  }

  handleSubmit (event) {
    event.preventDefault()
    const email = this.refs.email.value
    const password = this.refs.password.value

    request.post(API_PATH + '/login')
    .send({ email, password })
    .end((err, resp) => {
      if (err) return toastr.error(err.message)

      Session.save('user', resp.body)
      if (window.location.state && window.location.state.nextPathname) {
        this.router.replace(window.location.state.nextPathname)
      } else {
        this.router.replace('/')
      }
    })
  }

  render () {
    return (
      <Col xs={10} xsOffset={1} sm={6} smOffset={3} md={4} mdOffset={4}>
      <br/>
      <br/>
      <br/>
        <h4>Login in.</h4>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input ref='email' type='email' placeholder='your@email.com' className='form-control'></input>
          <br/>
          <input ref='password' type='password' placeholder='password' className='form-control'></input>
        <br/>
        <button type='submit' className='btn btn-info'>Log in</button>
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

Login.contextTypes = {
  router: React.PropTypes.object.isRequired
}
