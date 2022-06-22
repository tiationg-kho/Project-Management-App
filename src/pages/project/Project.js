import './Project.css'
import { useDocument } from '../../hooks/useDocument'
import ProjectSummary from './ProjectSummary'
import ProjectComments from './ProjectComments'

import React from 'react'
import { useParams } from 'react-router-dom'



const Project = () => {
  const {id} = useParams()

  const {document, error} = useDocument('projects', id)

  if (error) {
    return <p className='error'>{error}</p>
  }
  if (!document) {
    return <div className='loading'>loading</div>
  }

  return (
    <div className='project-details'>
      <ProjectSummary project={document}/>
      <ProjectComments project={document}/>
    </div>
  )
}

export default Project