import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'

import Cookies from 'js-cookie'
import FilterJobs from '../FilterJobs'
import JobsCard from '../JobsCard'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const locationList = [
  {
    label: 'Hyderabad',
    locationId: 'HYDERABAD',
  },
  {
    label: 'Bangalore',
    locationId: 'BANGALORE',
  },
  {
    label: 'Chennai',
    locationId: 'CHENNAI',
  },
  {
    label: 'Delhi',
    locationId: 'DELHI',
  },

  {
    label: 'Mumbai',
    locationId: 'MUMBAI',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobs extends Component {
  state = {
    allJobsDetailsList: [],
    apiStatus: apiStatusConstants.initial,
    checkboxInputs: [],
    employeeType: [],
    minimumSalary: 0,
    searchInput: '',
    locations: [],
  }

  componentDidMount() {
    this.getAllJobsDetailsView()
  }

  formatedAllJobsData = jobList => {
    return jobList.map(job => ({
      companyLogoUrl: job.company_logo_url,
      employmentType: job.employment_type,
      jobDescription: job.job_description,
      location: job.location,
      packagePerAnnum: job.package_per_annum,
      rating: job.rating,
      title: job.title,
      id: job.id,
    }))
  }

  getAllJobsDetailsView = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    // const {employeeType, minimumSalary, searchInput} = this.state
    // // const url = "https://apis.ccbp.in/jobs"
    // const employmentTypeString = employeeType.join(',')
    // console.log(employmentTypeString, 'eee')

    // const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeString}&minimum_package=${minimumSalary}&search=${searchInput}`

    // working
    // const {employeeType, minimumSalary, searchInput, locations} = this.state

    // const employmentTypeString = employeeType.join(',')
    // console.log(employmentTypeString)
    // const locationString = locations.join(',')
    // console.log(locationString)

    // const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeString}&minimum_package=${minimumSalary}&search=${searchInput}&location=${locationString}`

    const {employeeType, minimumSalary, searchInput, locations} = this.state

    const employmentTypeString = employeeType.join(',')
    const locationString = locations.join(',')

    console.log(
      'Constructed URL:',
      `https://apis.ccbp.in/jobs?employment_type=${employmentTypeString}&minimum_package=${minimumSalary}&search=${searchInput}&location=${locationString}`,
    )

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeString}&minimum_package=${minimumSalary}&search=${searchInput}&location=${locationString}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(url, options)

      if (response.ok) {
        // Handle successful response
        const fetchedData = await response.json()
        const formatedData = this.formatedAllJobsData(fetchedData.jobs)
        console.log(formatedData, 'dara')
        this.setState({
          allJobsDetailsList: formatedData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        console.error('Request failed:', response.status, response.statusText)
        const errorResponse = await response.json()
        console.error('Error response:', errorResponse)
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }
    } catch (error) {
      console.error('Fetch error:', error)
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="jobs-loader-container" data-testid='loader'>
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="jobs-failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button onClick={this.getAllJobsDetailsView}>Retry</button>
    </div>
  )

  renderJobsListView = () => {
    const {allJobsDetailsList} = this.state
    const shouldShowJobssList = allJobsDetailsList.length > 0

    return shouldShowJobssList ? (
      <div>
        {allJobsDetailsList.map(each => (
          <JobsCard allJobsDetails={each} key={each.id} id={each.id} />
        ))}
      </div>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-jobs-img"
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderAllJobs = () => {
    const {allJobsDetailsList, apiStatus} = this.state

    if (allJobsDetailsList.length > 0) {
      return this.renderJobsListView()
    }

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  // changeSalary = salary => {
  //   this.setState({minimumSalary: salary}, this.getAllJobsDetailsView)
  // }

  // changeEmployeeList = type => {
  //   this.setState(
  //     prev => ({employeeType: [...prev.employeeType, type]}),
  //     this.getAllJobsDetailsView,
  //   )
  // }

  changeEmployeeList = type => {
    this.setState(prev => {
      const updatedEmployeeType = prev.employeeType.includes(type)
        ? prev.employeeType.filter(item => item !== type)
        : [...prev.employeeType, type]

      return {employeeType: updatedEmployeeType}
    }, this.getAllJobsDetailsView)
  }

  changeSalary = salary => {
    this.setState({minimumSalary: salary}, this.getAllJobsDetailsView)
  }

  // working
  // changeLocationList = event => {
  //   console.log('Event:', event.target.value, event.target.checked)
  //   const {value, checked} = event.target
  //   this.setState(
  //     prevState => {
  //       const updatedLocations = checked
  //         ? [...prevState.locations, value]
  //         : prevState.locations.filter(location => location !== value)
  //       return {locations: updatedLocations}
  //     },
  //     () => {
  //       // Fetch jobs after updating locations
  //       this.getAllJobsDetailsView()
  //     },
  //   )
  // }

  // changeLocationList = locationId => {
  //   this.setState(
  //     prevState => {
  //       const {locations} = prevState
  //       const updatedLocations = locations.includes(locationId)
  //         ? locations.filter(id => id !== locationId)
  //         : [...locations, locationId]
  //       return {locations: updatedLocations}
  //     },
  //     () => {
  //       this.getAllJobsDetailsView()
  //     },
  //   )
  // }
  changeLocationList = (locationId, checked) => {
    this.setState(
      prevState => {
        const {locations} = prevState
        const updatedLocations = checked
          ? [...locations, locationId] // Add locationId to the array if checked
          : locations.filter(id => id !== locationId) // Remove locationId from the array if unchecked
        return {locations: updatedLocations}
      },
      () => {
        this.getAllJobsDetailsView()
      },
    )
  }

  onChangeSearchInput = event => {
    this.changeSearchInput(event)
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getAllJobsDetailsView()
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <div className="all-jobs-section">
        <div className="filter-section">
          <FilterJobs
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
            changeSearchInput={this.changeSearchInput}
            searchInput={searchInput}
            getJobs={this.getAllJobsDetailsView}
            changeSalary={this.changeSalary}
            changeEmployeeList={this.changeEmployeeList}
            locationList={locationList}
            changeLocationList={this.changeLocationList}
          />
        </div>
        <div className="filter-all-jobs">
          <div className="search-container search-section">
            <input
              className="search-input"
              type="search"
              placeholder="Search"
              value={searchInput}
              onChange={this.onChangeSearchInput}
              onKeyDown={this.onEnterSearchInput}
            />
            <button
              testid="searchButton"
              type="button"
              id="searchButton"
              className="search-button"
              onClick={this.getAllJobsDetailsView}
            >
              <AiOutlineSearch className="search-icon" />
            </button>
          </div>
          <div className="jobs-section">{this.renderAllJobs()}</div>
        </div>
      </div>
    )
  }
}

export default AllJobs
