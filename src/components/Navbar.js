import './Navbar.css'
import Temple from '../assets/temple.svg'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const {logout, isPending} = useLogout()
  const {user} = useAuthContext()

  return (
    <div className='navbar'>
      <ul>
        <li className='logo'>
          <img src={Temple} alt='project management logo'></img>
          <span>Project Management</span>
        </li>
        {!user && (
          <>
            <li>
              <Link to='/login'>Login</Link>
            </li>
            <li>
              <Link to='/signup'>Signup</Link>
            </li>
          </>
        )}
        {user && (
          <li>
            {!isPending && <button className='btn' onClick={logout}>Logout</button>}
            {isPending && <button className='btn' disabled>logging out</button>}
          </li>
        )}
      </ul>
    </div>
  )
}

export default Navbar