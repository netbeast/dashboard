/* global toastr */
import React from 'react'
import request from 'superagent-bluebird-promise'

export default class ExplorableApp extends React.Component {
  constructor (props, context) {
    super(props)
    this.router = context.router
    this.state = { hidden: false }
  }

  componentDidMount () {
    const GITHUB_ROOT = 'https://raw.githubusercontent.com/' + this.props.full_name + '/master/'
    const GITHUB_Q = GITHUB_ROOT + 'package.json'

    request.get(GITHUB_Q).end((err, res) => {
      if (err) return this.setState({ hidden: true })

      const { netbeast, logo } = JSON.parse(res.text)
      this.setState({ netbeast, logo: logo ? GITHUB_ROOT + logo : null })
    })
  }

  launch () {
    const { name } = this.props

    request.post('/api/activities/' + name).then(() => {
      return request.get('/i/' + name).promise()
    }).then(() => {
      this.router.push('/i/' + name)
    }).catch((err) => {
      if (err.status === 404) return toastr.info(`${name} is running`)
      toastr.error(err.message)
    })
  }

  install () {
    const name = this.props.name
    const url = this.props.git_url

    const loader = window.notify({ 
      body: (
        <span>
         <div className='loader'></div>
         Installing {name}...
        </span>
      ), timeout: 0, emphasis: 'info'}
    )

    request.post('/api/apps').send({ url }).then((res) => {
      const name = res.body.name
      const props = res.body.netbeast
      const type = props ? props.type : 'app'

      toastr.success(`${name} has been installed!`)
      toastr.dismiss(loader)

      if (type === 'plugin' || type === 'service' || props.bootOnLoad)
        return request.post('/api/activities/' + name).promise()
    }).then((res) => { toastr.success(`${res.body.name} is running`) })
    .catch((fail, res) => toastr.error(res.text))
  }

  renderButton () {
    const { installed, name } = this.props
    return installed ? <a href='javascript:void(0)' onClick={this.launch.bind(this)} className='install btn btn-filled btn-primary'> Launch </a>
    : <a href='javascript:void(0)' onClick={this.install.bind(this)} className='install btn btn-filled btn-info'> Install </a>
  }

  render () {
    if (this.state.hidden) return null

    const { name, author, filter } = this.props
    const { netbeast, logo } = this.state
    const isPlugin = netbeast && (netbeast.type === 'plugin')
    const defaultLogo = isPlugin ? 'url(/img/plugin.png)' : 'url(/img/dflt.png)'
    const logoStyle = { backgroundImage: logo ? `url(${logo})` : defaultLogo }

    if (filter === 'plugins' && !isPlugin) return null
    if (filter === 'apps' && isPlugin) return null

    return (
      <div className='app'>
        <div className='logo' title='Launch app' style={logoStyle} onClick={this.launch.bind(this)}>
        </div>
        {this.renderButton()}
        <h4 className='name'>{name}</h4>
      </div>
    )
  }
}

ExplorableApp.contextTypes = {
  router: React.PropTypes.object.isRequired
}
