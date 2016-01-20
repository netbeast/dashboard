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

  render () {
    return (
      <div className='app-install'>
        <Dropzone onDrop={this.handleDrop.bind(this)} className='preview' activeClassName='preview active'>
          <h1>Drop your apps here to upload them</h1>
          <h3>(or click here to search for it!)</h3>
        </Dropzone>
      </div>
    )
  }
}
