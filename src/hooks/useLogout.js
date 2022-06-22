import {useState, useEffect} from 'react'
import { db, auth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { signOut } from "firebase/auth"
import { updateDoc, doc } from "firebase/firestore"

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const {dispatch, user} = useAuthContext()

  const logout = async () => {
    setError(null)
    setIsPending(true)

    // sign out
    try {

      // change own online status in firestore
      const {uid} = user
      const ref = doc(db, 'users', uid)
      await updateDoc(ref, {
        online: false
      })

      // log out
      await signOut(auth)

      // dispatch logout action
      dispatch({type: 'LOGOUT'})

      // update state
      if (!isCancelled){
        setError(null)
        setIsPending(false)
      }

    } catch (error) {
      if (!isCancelled){
        console.log(error.message)
        setError(error.message)
        setIsPending(false)
      }
    }

  }

  useEffect(() => {
    // return a clean up function
    return () => setIsCancelled(true)
  }, [])

  return {logout, error, isPending}

}