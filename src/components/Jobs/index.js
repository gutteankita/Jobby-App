import {Component} from 'react'
import Header from '../Header'
import AllJobs from '../AllJobs'
import './index.css'

class Jobs extends Component {
  render() {
    return (
      <>
        <Header />

        <div className="jobs-container">
          <AllJobs />
        </div>
      </>
    )
  }
}

export default Jobs
