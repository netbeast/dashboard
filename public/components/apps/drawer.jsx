import React from 'react'
import { Link } from 'react-router'

import VersionPod from '../misc/version-pod.jsx'
import NetworkApp from '../devices/network-app.jsx'
import AppsList from './apps-list.jsx'

class ExploreApp extends React.Component {
  render () {
    const { route } = this.props
    const pathname = route.path ? route.path : 'apps'
    const logoStyle = { backgroundImage: 'url(/img/explore.png)' }

    if (pathname !== 'apps' && pathname !== 'plugins') return null

    return (
      <div className='app'>
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
        <ul className='list-unstyled list-inline'>
          <li><Link to='/'><i className='fa fa-th' /> Apps</Link></li>
          <li><Link to='/plugins'><i className='fa fa-package'><img src='/img/plugin.png'/></i> Plugins</Link></li>
          <li><Link to='/activities'><i className='fa fa-dashboard' /> Activities</Link></li>
          <li><Link to='/install'> <i className='fa fa-package'><img src='/img/package-unfilled.png'/></i> Install</Link></li>
          <li><Link to='/remove'> <i className='fa fa-trash' /> Remove</Link></li>
        </ul>
      </div>
    )
  }

  render () {
    const pathname = 'apps'
    return (
        <div className='drawer'>
          {this.renderNav()}
          <AppsList src={'/api/' + this.state.pathname} {...this.props} 
          prepend={[
            <ExploreApp key='explore-app' {...this.props} />,
            <NetworkApp key='network-app' {...this.props} />]
          }
          append={<InstallApp {...this.props}/>}/>
          <VersionPod />
        </div>
    )
  }
}

// Drawer.contextTypes = {
//   router: React.PropTypes.object.isRequired
// }
