import {Component} from 'react'
// import {FaSearch} from 'react-icons/fa'
import {AiOutlineSearch} from 'react-icons/ai'
import Profile from '../Profile'

import './index.css'

class FilterJobs extends Component {
  onChangeSearchInput = event => {
    const {changeSearchInput} = this.props
    changeSearchInput(event)
  }

  onEnterSearchInput = event => {
    const {getJobs} = this.props
    if (event.key === 'Enter') {
      getJobs()
    }
  }
  onSelectEmployeeType = event => {
    const {changeEmployeeList} = this.props
    changeEmployeeList(event.target.value)
  }
  onSelectSalaryRange = () => {
    const {changeSalary} = this.props
    changeSalary()
  }

  onSelectLocation = event => {
    const {changeLocationList} = this.props
    const {value, checked} = event.target

    // Call changeLocationList with the value of the checkbox
    changeLocationList(value, checked)
  }

  render() {
    const {
      getJobs,
      searchInput,
      employmentTypesList,
      salaryRangesList,
      locationList,
      changeLocationList,
    } = this.props
    return (
      <>
        <div className="filter-search">
          <input
            className="input-search"
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
            className="button-search"
            onClick={getJobs}
          >
            <AiOutlineSearch className="icon-search" />
          </button>
        </div>
        <div className="profile-container">
          <Profile />
        </div>
        <hr />
        <div className="filter-container">
          <h1 className="type">Type of Employment</h1>
          <ul className="ul-lists">
            {employmentTypesList.map(type => {
              return (
                <li className="list-items" key={type.employmentTypeId}>
                  <input
                    className="input"
                    type="checkbox"
                    id={type.employmentTypeId}
                    value={type.employmentTypeId}
                    onChange={this.onSelectEmployeeType}
                  />
                  <label htmlFor={type.employmentTypeId}>{type.label}</label>
                </li>
              )
            })}
          </ul>
          <hr />

          <h1 className="type">Location</h1>
          <ul className="ul-lists">
            {locationList.map(location => (
              <li className="list-items" key={location.locationId}>
                <input
                  className="input"
                  type="checkbox"
                  id={location.locationId}
                  value={location.locationId}
                  onChange={this.onSelectLocation}
                />

                <label htmlFor={location.locationId}>{location.label}</label>
              </li>
            ))}
          </ul>
          <hr />

          <h1 className="type">Salary Range</h1>
          <ul className="ul-lists">
            {salaryRangesList.map(eachSalary => {
              const {changeSalary} = this.props
              const onClickSalary = () => {
                changeSalary(eachSalary.salaryRangeId)
              }
              return (
                <li className="list-items" key={eachSalary.salaryRangeId}>
                  <input
                    type="radio"
                    id={eachSalary.salaryRangeId}
                    name="salary"
                    className="input"
                    onClick={onClickSalary}
                  />
                  <label htmlFor={eachSalary.salaryRangeId} className="label">
                    {eachSalary.label}
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      </>
    )
  }
}

export default FilterJobs
