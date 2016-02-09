import React from 'react'
import { Link } from 'react-router'

export default class Launcher extends React.Component {
  constructor () {
    super()
    this.state = { collapsed: true }
  }

  render () {
    const state = this.state.collapsed ? 'collapsed' : ''
    return (
      <div className={'launcher ' + state}>
        <ul>
          <li><Link to='/uninstall' className='btn btn-primary'>Remove</Link></li>
          <li><Link to='/install' className='btn btn-danger'>Install</Link></li>
          <li><Link to='/activities' className='btn btn-warning'>Activities</Link></li>
          <li><Link to='/plugins' className='btn btn-success'>Plugins</Link></li>
          <li className='anchor'><Link to='/' className='btn btn-info'>Apps</Link></li>
        </ul>
      </div>
    )
  }
}
