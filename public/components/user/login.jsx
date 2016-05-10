/* global toastr */

import React from 'react'
import { Link } from 'react-router'
import request from 'superagent'

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
      console.log(err)
      if (err) return toastr.error(resp ? resp.text : err.message)

      window.logIn(resp.body)
    })
  }

  render () {
    return (
      <div className='user-view'>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <h1>Log in.</h1>
          <input ref='email' type='email' placeholder='your@email.com' className='form-control'></input>
          <br/>
          <input ref='password' type='password' placeholder='password' className='form-control'></input>
          <br/>
          <button type='submit' className='btn btn-info'>Log in</button>
          <br/>
          <span>
            Don't you have an account yet? <Link to='/signup'>Sign up</Link>.
            <br/>
            <small>Check out our terms and services.</small>
          </span>
        </form>
      </div>
    )
  }
}

Login.contextTypes = {
  router: React.PropTypes.object.isRequired
}
