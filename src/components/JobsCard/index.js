import {Component} from 'react'
import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

class JobsCard extends Component {
  render() {
    const {allJobsDetails} = this.props
    const {
      id,
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = allJobsDetails
    return (
      <>
        <Link to={`/jobs/${id}`} className="all-jobs-link">
          <div className="jobs-card-container">
            <div className="jobs-logo-tile-rating-container">
              <img
                src={companyLogoUrl}
                alt="company logo"
                className="company-logo"
              />
              <div className="tile-rating-container">
                <h1 className="job-title">{title}</h1>
                <div className="star-rating-container">
                  <FaStar className="star-icon" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="job-loc-employment-type-pack-container">
              <div className="location-employment-type-container">
                <div className="location-container">
                  <MdLocationOn className="location-icon" />
                  <p className="job-location">{location}</p>
                </div>
                <div className="employment-type-container">
                  <BsFillBriefcaseFill className="employment-type-icon" />
                  <p className="employment-type">{employmentType}</p>
                </div>
              </div>
              <p className="package">{packagePerAnnum}</p>
            </div>
            <hr className="seperation" />

            <h1 className="description-heading">Description</h1>
            <p className="job-description">{jobDescription}</p>
          </div>
        </Link>
      </>
    )
  }
}

export default JobsCard
