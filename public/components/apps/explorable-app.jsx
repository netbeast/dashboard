/* global toastr */
import React from 'react'
import request from 'superagent-bluebird-promise'
import { Session } from '../lib'

// Analytics
var Mixpanel = require('mixpanel')
var mixpanel = Mixpanel.init('e794af6318eedbddd288e440a50c16f5')
var user = Session.load('user') || {}

export default class ExplorableApp extends React.Component {
  constructor (props, context) {
    super(props)
    this.router = context.router
    this.state = { hidden: false, installed: props.installed }
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
      this.router.push('/live/' + name)
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

      this.setState({ installed: true })

      toastr.success(`${name} has been installed!`)

      mixpanel.track('Installed app/plugin', {
        distinct_id: user.email,
        name: name,
        type
      })

      if (type === 'plugin' || type === 'service' || (props && props.bootOnLoad)) {
        mixpanel.track('Running app/plugin', {
          distinct_id: user.email,
          name: name,
          type: 'plugin'
        })
        return request.post('/api/activities/' + name).promise()
      }
    }).then((res) => { toastr.success(`${res.body.name} is running`) })
    .catch((err) => {
      if (err.res) toastr.error(err.res.text)
      else toastr.error(err.message)
    })
    .finally(() => toastr.dismiss(loader))
  }

  renderButton () {
    const { name } = this.props
    const { installed } = this.state
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

    if (filter.type === 'plugins' && !isPlugin) return null
    if (filter.type === 'apps' && isPlugin) return null

    return (
      <div className='app'>
        <a target='_blank' href={this.props.html_url}>
        <div className='logo' title='Try this app' style={logoStyle}>
        </div>
        </a>
        {this.renderButton()}
        <h4 className='name'>{name}</h4>
      </div>
    )
  }
}

ExplorableApp.contextTypes = {
  router: React.PropTypes.object.isRequired
}
