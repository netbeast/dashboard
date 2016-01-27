import React from 'react'
import Dropzone from 'react-dropzone'
import request from 'superagent'

export default class InstallView extends React.Component {
  constructor (props) {
    super(props)
    this.state = { gitFieldsHidden: true }
  }

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

    request.post('/api/apps').send({ url: this.state.url }).end((err, res) => {
      if (err) return window.toastr.error(res.text)
      window.toastr.success(`${res.body.name} has been installed!`)
    })
  }

  render () {
    let toggleGitFields = function () {
      this.setState({ gitFieldsHidden: !this.state.gitFieldsHidden })
    }
    return (
      <div className='app-install'>
      <Dropzone onDrop={this.handleDrop.bind(this)} className='preview' activeClassName='preview active'>
      <h1>Drop apps here to install them.</h1>
      <h3>(or click here to browse among your files).</h3>
      </Dropzone>
      <br/>
      <a href='explore' className='btn btn-info'>Explore</a> &nbsp;
      <a href='#' onClick={toggleGitFields.bind(this)} className='btn btn-default'>with git</a>
      { this.state.gitFieldsHidden ? null : <form className='install-from-git' onSubmit={this.handleSubmit.bind(this)}>
      <input name='url' type='url' onChange={this.handleTextChange.bind(this)} placeholder='Paste here an URL to install from git' />
      <input type='submit' className='btn btn-default' value='install' />
      </form>}
      </div>
    )
  }
}
