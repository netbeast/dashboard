import React from 'react'
import { Link } from 'react-router'

const PLACES = ['uninstall', 'install', 'remove', 'activities', 'plugins', 'root']

export default class Launcher extends React.Component {
  constructor (props) {
    super(props)
    this.state = { path: this.getPath() }
    this.isAnchor = this.isAnchor.bind(this)
  }

  isAnchor (path) {
    return path === this.state.path ? 'anchor' : ''
  }

  getPath (nextProps) {
    const { location } = nextProps || this.props
    const regexp = new RegExp('/', 'g')
    const pathname = location.pathname.replace(regexp, '')
    return (pathname === '') ? 'root' : pathname
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ path: this.getPath(nextProps) })
  }

  renderMenuAnchor () {
    return PLACES.includes(this.state.path) ? null
    : <li className={'anchor'}>
      <a href='' className='btn btn-info'>{this.state.path}</a>
    </li>
  }

  render () {
    const state = this.state.collapsed ? 'collapsed' : ''
    return (
      <div className={'launcher ' + state}>
        <ul>
          <li className={this.isAnchor('uninstall')}>
            <Link to='/uninstall' className='btn btn-primary'>Remove</Link>
          </li>
          <li className={this.isAnchor('install')}>
            <Link to='/install' className='btn btn-danger'>Install</Link>
          </li>
          <li className={this.isAnchor('activities')}>
            <Link to='/activities' className='btn btn-warning'>Activities</Link>
          </li>
          <li className={this.isAnchor('plugins')}>
            <Link to='/plugins' className='btn btn-success'>Plugins</Link>
          </li>
          <li className={this.isAnchor('root')}>
            <Link to='/' className='btn btn-info'>Dashboard</Link>
          </li>
          {this.renderMenuAnchor()}
        </ul>
      </div>
    )
  }
}
