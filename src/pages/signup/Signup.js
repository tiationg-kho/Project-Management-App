import './Signup.css'
import { useSignup } from '../../hooks/useSignup'

import React from 'react'
import { useState } from 'react'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailError, setThumbnailError] = useState(null)
  const {signup, isPending, error} = useSignup()

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(email, password, displayName, thumbnail)
  }

  const handleFileChange = (e) => {
    setThumbnail(null)
    let selected = e.target.files[0]
    console.log(selected)

    if (!selected) {
      setThumbnailError('please select a file')
      return
    }
    if (!selected.type.includes('image')) {
      setThumbnailError('please select an image file')
      return
    }
    if (selected.size > 10000000) {
      setThumbnailError('file\'s size is too large')
      return
    }
    setThumbnailError(null)
    setThumbnail(selected)
    console.log('thumbnail updated')

  }
  
  return (
    <form className='auth-form' onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <label>
        <span>email:</span>
        <input required type='email' onChange={(e) => setEmail(e.target.value)} value={email}></input>
      </label>
      <label>
        <span>password:</span>
        <input required type='password' onChange={(e) => setPassword(e.target.value)} value={password}></input>
      </label>
      <label>
        <span>displayName:</span>
        <input required type='text' onChange={(e) => setDisplayName(e.target.value)} value={displayName}></input>
      </label>
      <label>
        <span>profile thumbnail:</span>
        <input required type='file' onChange={handleFileChange}></input>
        {thumbnailError && <div className='error'>{thumbnailError}</div>}
      </label>
      {!isPending && !thumbnailError && <button className='btn'>Sign up</button>}
      {!isPending && thumbnailError && <button className='btn' disabled>Sign up</button>}
      {isPending && <button className='btn' disabled>loading</button>}
      {error && <div className='error'>{error}</div>}

    </form>
  )
}

export default Signup