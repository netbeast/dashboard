import React from 'react'

export default class FilterSVG extends React.Component {
  render () {
    const { src } = this.props
    const icon = src === 'default' ? '/img/device.png' : `/api/apps/${src}/logo`

    return (
      <filter id={src} x='0%' y='0%' width='100%' height='100%'>
        <feImage xlinkHref={icon} />
      </filter>
    )
  }
}
