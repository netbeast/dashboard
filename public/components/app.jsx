import React from 'react'

export default class App extends React.Component {
  render () {
    const { name, author } = this.props
    const logo = `/apps/${name}/logo`
    return (
      <div className='app'>
        <div className='logo'>
          <img className='filter-to-white' src={logo} alt={logo} />
        </div>
        <h4>
          <br/> <span className='name'>{name}</span>
          <br/> <span className='author'>{author}</span>
        </h4>
      </div>
    )
  }
}
