import React from 'react'
import { Link } from 'react-router'

import VersionPod from '../misc/version-pod.jsx'
import DevicesPod from '../misc/devices-pod.jsx'
import AppsList from './apps-list.jsx'

class ExploreApp extends React.Component {
  render () {
    const { route } = this.props
    const pathname = route.path ? route.path : 'apps'
    const logoStyle = { backgroundImage: 'url(/img/explore.png)' }

    if (pathname !== 'apps' && pathname !== 'plugins') return null

    return (
      <div className='app app-explore'>
        <Link to='/explore'>
          <div className='logo' title='Launch app' style={logoStyle} />
        </Link>
        <h4 className='name'> Explore </h4>
      </div>
    )
  }
}

class InstallApp extends React.Component {
  render () {
    const { route } = this.props
    const pathname = route.path ? route.path : 'apps'
    const logoStyle = { backgroundImage: 'url(/img/package.png)' }

    if (pathname !== 'apps' && pathname !== 'plugins') return null

    return (
      <div className='app'>
        <Link to='/install'>
          <div className='logo' title='Install an app manually' style={logoStyle} />
        </Link>
        <h4 className='name'> Install </h4>
      </div>
    )
  }
}

export default class Drawer extends React.Component {
  constructor (props, context) {
    super(props)
    this.state = { pathname: this.getPath() }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ pathname: this.getPath(nextProps) })
  }

  getPath (nextProps) {
    const { location } = nextProps || this.props
    const aux = location.pathname.split('/')
    const pathname = aux[aux.length - 1]
    return (pathname === '') ? 'apps' : pathname
  }

  renderNav () {
    let title = ''

    switch (this.state.pathname) {
      case 'apps':
        title = 'Apps installed.'
        break
      case 'plugins':
        title = 'Plugins installed.'
        break
      case 'activities':
        title = 'Applications running.'
        break
      case 'remove':
        title = 'Remove any module.'
        break
    }

    return (
      <div className='nav'>
        <span className='title'><h4>{title}</h4></span>
        <ul className='list-unstyled list-inline pull-left'>
          <li><Link to='/'>Apps</Link></li>
          <li><Link to='/plugins'>Plugins</Link></li>
        </ul>
        <ul className='list-unstyled list-inline pull-right'>
          <li><Link to='/activities'><i className='glyphicon glyphicon-dashboard' /> Activities</Link></li>
          <li><Link to='/install'> <i className='glyphicon glyphicon-package'><img src='/img/package-unfilled.png'/></i> Install</Link></li>
          <li><Link to='/remove'> <i className='glyphicon glyphicon-trash' /> Remove</Link></li>
        </ul>
      </div>
    )
  }

  render () {
    const pathname = 'apps'
    return (
        <div className='drawer'>
          {this.renderNav()}
          <AppsList src={'/api/' + this.state.pathname} {...this.props} prepend={<ExploreApp {...this.props} />} append={<InstallApp {...this.props}/>}/>
          <DevicesPod />
          <VersionPod />
        </div>
    )
  }
}

// Drawer.contextTypes = {
//   router: React.PropTypes.object.isRequired
// }
