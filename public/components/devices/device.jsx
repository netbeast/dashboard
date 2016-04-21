import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

import Adapter from './controls.jsx'
import { _coords } from './helper'

export default class Device extends React.Component {

  render () {
    const { idx, info } = this.props
    const { x, y } = _coords(idx)

    const style = {
      filter: `url(#${info.app || 'default'})`
    }

    return (
      <g className='device'>
        <rect x={x - 25} y={y - 25} rx='25' ry='25' fill='none' width={50} height={50}/>
        <OverlayTrigger trigger={['click']} rootClose placement='top' overlay={Adapter(this.props)}>
          <circle cx={x} cy={y} r='25' style={style} />
        </OverlayTrigger>
      </g>
    )
  }
}
