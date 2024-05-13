import React from 'react'
import Router from './app-router'
import './styles.css'

class Application extends React.Component {
  render () {
    return <div className="container">
      <Router />
    </div>
  }
}

export default Application
