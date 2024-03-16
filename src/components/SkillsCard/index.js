import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

class SkillsCard extends Component {
  render() {
    const {skills} = this.props
    const {imageUrl, name} = skills
    return (
      <>
        <li className="jobs-skills-container">
          <img className="skills-img" src={imageUrl} alt={name} />
          <p className="skills-name">{name}</p>
        </li>
      </>
    )
  }
}

export default SkillsCard
