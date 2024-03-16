import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {RiExternalLinkLine} from 'react-icons/ri'

import SkillsCard from '../SkillsCard'
import SimilarJobs from '../SimilarJobs'

import Header from '../Header'

import './index.css'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemData()
  }

  formatedJobsData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    rating: data.rating,
    title: data.title,
    packagePerAnnum: data.package_per_annum,
    skills: data.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
  })

  formatedSimilarJobsData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
    id: data.id,
  })

  getJobItemData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedJobsData = this.formatedJobsData(fetchedData.job_details)
      const updatedSimilarJobsData = fetchedData.similar_jobs.map(eachData =>
        this.formatedSimilarJobsData(eachData),
      )

      this.setState({
        jobData: updatedJobsData,
        similarJobsData: updatedSimilarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className='jobs-loader-container' testid='loader'>
      <Loader type='ThreeDots' color='#0b69ff' height='50' width='50' />
    </div>
  )

  renderFailureView = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    return (
      <div className='jobs-error-view-container'>
        <img
          src='https://assets.ccbp.in/frontend/react-js/failure-img.png'
          alt='failure view'
          className='jobs-failure-img'
        />
        <h1 className='jobs-failure-heading-text'>
          Oops! Something Went Wrong
        </h1>
        <p className='jobs-failure-description'>
          We cannot seem to find the page you are looking for
        </p>
        <button onClick={this.getJobItemData}>Retry</button>
      </div>
    )
  }

  renderJobItemDetailsView = () => {
    const {jobData, similarJobsData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      lifeAtCompany,
      skills,
    } = jobData
    console.log(jobData, 'jj')
    const {description, imageUrl} = lifeAtCompany

    return (
      <>
        <Header />
        <div className='job-item-container'>
          <div className='jobs-card-container'>
            <div className='jobs-logos-tile-rating-container'>
              <img
                src={companyLogoUrl}
                alt='job details company logo'
                className='companys-logo'
              />
              <div className='tile-rating-container'>
                <h1 className='jobs-title'>{title}</h1>
                <div className='star-rating-container'>
                  <FaStar className='stars-icon' />
                  <p className='ratings'>{rating}</p>
                </div>
              </div>
            </div>
            <div className='job-loc-employment-type-pack-container'>
              <div className='location-employment-type-container'>
                <div className='location-container'>
                  <MdLocationOn className='locations-icon' />
                  <p className='jobs-location'>{location}</p>
                </div>
                <div className='employment-type-container'>
                  <BsFillBriefcaseFill className='employments-type-icon' />
                  <p className='employments-type'>{employmentType}</p>
                </div>
              </div>
              <p className='packages'>{packagePerAnnum}</p>
            </div>
            <hr className='seperation' />
            <div className='description-website-url-container'>
              <h1 className='descriptions-heading'>Description</h1>
              <a href={companyWebsiteUrl} className='company-website-url'>
                Visit
                <RiExternalLinkLine className='company-website-url-icon' />
              </a>
            </div>
            <p className='jobs-description'>{jobDescription}</p>
            <h1 className='skills-heading'>Skills</h1>
            <ul className='skills-card'>
              {skills.map(each => (
                <SkillsCard skills={each} key={each.name} />
              ))}
            </ul>
            <h1 className='life-at-company-heading'>Life at Company</h1>
            <div className='life-at-company-container'>
              <p className='life-at-company-description'>{description}</p>
              <img
                src={imageUrl}
                className='life-at-company-img'
                alt='life_at_company'
              />
            </div>
          </div>
        </div>
        <h1 className='similar-jobs-heading'>Similar Jobs</h1>
        <ul className='similar-jobs-list'>
          {similarJobsData.map(eachSimilarJob => (
            <SimilarJobs
              similarJobDetails={eachSimilarJob}
              key={eachSimilarJob.id}
            />
          ))}
        </ul>
      </>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div className='job-items-container'>{this.renderJobDetails()}</div>
      </>
    )
  }
}

export default JobItemDetails
