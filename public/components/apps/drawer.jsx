import React from 'react'
import { Link } from 'react-router'

import VersionPod from '../misc/version-pod.jsx'
import NetworkApp from '../devices/network-app.jsx'
import AppsList from './apps-list.jsx'

class ExploreApp extends React.Component {
  render () {
    const logoStyle = { backgroundImage: 'url(/img/explore.png)' }

    return (
      <div className='app'>
        <Link to={'/explore?type=' + this.props.pathname}>
          <div className='logo' title='Explore apps or plugins' style={logoStyle} />
        </Link>
        <h4 className='name'> Explore </h4>
      </div>
    )
  }
}

class HistoryApp extends React.Component {
  render () {
    const { route } = this.props
    const pathname = route.path ? route.path : 'apps'
    const logoStyle = { backgroundImage: 'url(/img/history.png)' }

    if (pathname !== 'apps') return null

    return (
      <div className='app'>
        <Link to='/history'>
          <div className='logo' title='Open history' style={logoStyle} />
        </Link>
        <h4 className='name'> History </h4>
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

  componentDidMount () { window.title('Netbeast') }

  render () {
    return (
        <div className='apps-drawer'>
          <AppsList src={'/api/' + this.state.pathname} {...this.props}
          prepend={[
            <ExploreApp key='explore-app' {...this.props} {...this.state} />,
            <NetworkApp key='network-app' {...this.props} />,
            <HistoryApp key='history-app' {...this.props} />]
          }/>
          <VersionPod />
        </div>
    )
  }
}

// Drawer.contextTypes = {
//   router: React.PropTypes.object.isRequired
// }
