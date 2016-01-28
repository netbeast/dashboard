import React from 'react'
import { Link } from 'react-router'

export default class NotFound extends React.Component {
  render () {
    return (
      <div className='not-found'>
        <h1>Page not found</h1>
        <p>Sorry, the resource you were looking for was not found :/</p>
      </div>
    )
  }
}
