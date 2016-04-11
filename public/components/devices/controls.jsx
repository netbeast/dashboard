import React from 'react'
import { Popover } from 'react-bootstrap'
import netbeast from 'netbeast'

class SwitchButton extends React.Component {
  constructor () {
    super()
    this.state = { switch: false }
    this.toggle = this.toggle.bind(this)
  }

  toggle () {
    const { toggle, whenOn, whenOff } = this.props
    this.setState({ switch: !this.state.switch })
    if (typeof toggle === 'function') return toggle(this.state)
    if (typeof whenOn === 'function' && this.state.switch) return whenOn()
    if (typeof whenOff === 'function' && !this.state.switch) return whenOff()
  }

  render () {
    const on = this.props.on || 'ON'
    const off = this.props.off || 'OFF'
    const className = this.state.switch ? 'on' : 'off'
    const state = this.state.switch ? on : off
    return (
      <div className='switch-button'>
        <span onClick={this.toggle} className={'clickable switch-button-layout'}> 
        <i className={'fa fa-circle ' + className}/>
        </span>
        &nbsp;{state}&nbsp;
      </div>
    )
  }
}

class Switch extends React.Component {
  turnOn () {
    netbeast('switch').set({ power: 1 })
  }

  turnOff () {
    netbeast('switch').set({ power: 0 })
  }

  render () {
    return (
      <Popover {...this.props} id={this.props.idx}>
        <SwitchButton whenOn={this.turnOn} whenOff={this.turnOff}/>
      </Popover>
    )
  }
}

export class Default extends React.Component {
  render () {
    return (
      <Popover {...this.props} id={this.props.idx}>
        <ul className='list-unstyled'>
        {Object.keys(this.props.info).map((key, idx) => {
          if (key === 'idx') return null
          return <li key={idx} className='field'>{key}: {this.props.info[key]}</li>
        })}
        </ul>
      </Popover>
    )
  }
}

// Don't know actually if Decorator is the correct pattern
// or Adapter
export default function Adapter (device) {
  switch(device.info.topic) {
    case 'switch':
      return <Switch {...device} />
    default:
      return <Default {...device} />
  }
}