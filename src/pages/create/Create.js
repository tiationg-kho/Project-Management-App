import './Create.css'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import { timestamp } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'

import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import {useNavigate} from 'react-router-dom'

const categories = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'fieldwork', label: 'Fieldwork' },
  { value: 'marketing', label: 'Marketing' },
]


const Create = () => {
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [assignedUsers, setAssignedUsers] = useState([])
  const {documents} = useCollection('users')
  const [users, setUsers] = useState([])
  const {user} = useAuthContext()
  const [formError, setFormError] = useState(null)
  const {addDocument, response} = useFirestore('projects')
  const navigate = useNavigate()

  useEffect(() => {
    if (documents) {
      const options = documents.map((userDoc) => {
        if (user.uid === userDoc.id) {
          return {value: userDoc,label: `${userDoc.displayName} (myself)`}
        } else {
          return {value: userDoc,label: userDoc.displayName}
        }
      })
      setUsers(options)
    }
  }, [documents, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    if (!category) {
      setFormError('please select a project category')
      return
    }
    if (assignedUsers.length < 1) {
      setFormError('please assign project to at least one user')
      return
    }

    const project = {
      name,
      details,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      category: category.value,
      comments: [],
      createdBy: {displayName: user.displayName, photoURL: user.photoURL, id: user.uid},
      assignedUsersList: assignedUsers.map((u) => {
        return {
          displayName: u.value.displayName, 
          photoURL: u.value.photoURL, 
          id: u.value.id
        }
      })
    }
    
    // create project in firestore
    await addDocument(project)

    if (!response.error) {
      navigate('/')
    }


  }

  return (
    <div className='create-form'>
      <h2 className='page-title'>Create a new project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project name:</span>
          <input required type='text' onChange={(e) => setName(e.target.value)} value={name}></input>
        </label>
        <label>
          <span>Project details:</span>
          <textarea required type='text' onChange={(e) => setDetails(e.target.value)} value={details}></textarea>
        </label>
        <label>
          <span>Project dueDate:</span>
          <input required type='date' onChange={(e) => setDueDate(e.target.value)} value={dueDate}></input>
        </label>
        <label>
          <span>Project category:</span>
          <Select options={categories} onChange={(option) => setCategory(option)}></Select>
        </label>
        <label>
          <span>Assign to:</span>
          <Select options={users} onChange={(option) => setAssignedUsers(option)} isMulti></Select>
        </label>
        <button className='btn'>Add project</button>
        {formError && <p className='error'>{formError}</p>}
      </form>
    </div>
  )
}

export default Create