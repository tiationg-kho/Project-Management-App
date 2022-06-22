import './OnlineUsers.css'
import Avatar from './Avatar'
import { useCollection } from '../hooks/useCollection'
import { useAuthContext } from '../hooks/useAuthContext'

import React from 'react'


const OnlineUsers = () => {
  const {documents, error} = useCollection('users')
  const {user} = useAuthContext()

  return (
    <div className='user-list'>
      <h2>Crew</h2>
      {error && <div className='error'>{error}</div>}
      {documents && documents.map((userDoc) => {
        if (userDoc.id !== user.uid){
          return (
          <div key={userDoc.id} className='user-list-item'>
            {userDoc.online && <span className='online-user'></span>}
            <span>{userDoc.displayName}</span>
            <Avatar src={userDoc.photoURL}></Avatar>
          </div>
          )
        }else{
          return null
        }
      })}
    </div>
  )
}

export default OnlineUsers