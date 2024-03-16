import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <div className="home-container">
          <div className="content-container">
            <h1 className="home-heading">Find The Job That Fits Your Life</h1>
            <p className="home-description ">
              Millions of people are searching for jobs{' '}
            </p>
            <Link to="/jobs">
              <button type="button" className="jobs-btn">
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </>
    )
  }
}

export default Home
