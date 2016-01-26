import React from 'react'
import Dropzone from 'react-dropzone'
import request from 'superagent'

export default class InstallView extends React.Component {

  handleDrop (files) {
    var req = request.post('/api/apps')
    files.forEach((file) => {
      window.toastr.info(`Uploading ${file.name}...`)
      req.attach(file.name, file)
    })
    req.end((err, res) => {
      if (err) return window.toastr.error(res.text)
      window.toastr.success(`${res.body.name} has been installed!`)
    })
  }

  handleTextChange (event) {
    this.setState({ url: event.target.value })
  }

  handleSubmit (event) {
    event.preventDefault()

    request.post('/api/apps')
    .send({ url: this.state.url })
    .end((err, res) => {
      if (err) return window.toastr.error(res.text)
      window.toastr.success(`${res.body.name} has been installed!`)
    })
  }

  render () {
    return (
      <div className='app-install'>
        <Dropzone onDrop={this.handleDrop.bind(this)} className='preview' activeClassName='preview active'>
          <h1>Drop apps here to install them.</h1>
          <h3>(or click here to search for it!)</h3>
        </Dropzone>
        <form className='install-from-git' onSubmit={this.handleSubmit.bind(this)}>
          <input name='url' type='url' onChange={this.handleTextChange.bind(this)} placeholder='Paste here an URL to install from git' />
          <input type='submit' value='install' />
        </form>
      </div>
    )
  }
}
