import React from 'react'

export default class App extends React.Component {
  render () {
    const { name, author } = this.props
    const logo = `/apps/${name}/logo`
    return (
      <div className='app'>
        <img src={logo} alt={logo} />
        <h4> <br/>
          {name} <br/>
          {author}
          </h4>
      </div>
    )
  }
}
