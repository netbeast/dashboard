import React from 'react'

export default class Pulse extends React.Component {
  render () {
    const { name } = this.props
    return (
      <div className='pulse-container' title={name + ' is running'}>
        <svg className='p-svg-pulse' x='0px' y='0px'
          viewBox='0 0 80 80' enableBackground='new 0 0 80 80'>
          <circle className='pulse' fill='none' stroke='#FF0000' strokeMiterlimit='10' cx='40' cy='40' r='11'/>
          <circle className='halo' fill='none' stroke='#FF9C00' strokeWidth='2' strokeMiterlimit='10' cx='40' cy='40' r='16'/>
          <circle className='center' fill='#FF9C00' cx='40' cy='40' r='10'/>
          </svg>
      </div>
    )
  }
}
