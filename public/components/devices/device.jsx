import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

import { _coords } from './helper'

export default class DeviceDot extends React.Component {

  render () {
    const { app, idx } = this.props
    const { x, y } = _coords(idx)

    const style = {
      filter: `url(#${app || 'default'})`
    }

    const popover = (
      <Popover id={idx}>
        <ul className='list-unstyled'>
        {Object.keys(this.props).map((key, idx) => {
          if (key === 'idx') return null
          return <li key={idx} className='field'>{key}: {this.props[key]}</li>
        })}
        </ul>
      </Popover>
    )

    return (
      <g className='device'>
        <rect x={x - 25} y={y - 25} rx='25' ry='25' fill='none' width={50} height={50}/>
        <OverlayTrigger trigger={['click']} rootClose placement='top' overlay={popover}>
          <circle cx={x} cy={y} r='25' style={style} />
        </OverlayTrigger>
      </g>
    )
  }
}
