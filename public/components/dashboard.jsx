import React from 'react'

import Notifications from './notifications'
import Launcher from './launcher.jsx'
import VersionPod from './misc/version-pod.jsx'
import DevicesPod from './misc/devices-pod.jsx'

export default class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.getPathClassName = this.getPathClassName.bind(this)
    this.state = { path: this.getPathClassName() }
  }

  getPathClassName (nextProps) {
    const { location } = nextProps || this.props
    const regexp = new RegExp('/', 'g')
    const pathname = location.pathname.replace(regexp, '-')
    return (pathname === '-') ? '-root' : pathname
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ path: this.getPathClassName(nextProps) })
  }

  render () {
    const { path } = this.state
    return (
      <div id='dashboard' className={`path${path}`}>
        <DevicesPod />
        <Notifications />
        <main>
          {this.props.children}
        </main>
        <Launcher />
        <VersionPod />
      </div>
    )
  }
}

Dashboard.propTypes = {
  children: React.PropTypes.element
}
