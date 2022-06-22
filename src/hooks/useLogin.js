import {useState, useEffect} from 'react'
import { db, auth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { signInWithEmailAndPassword } from "firebase/auth"
import { updateDoc, doc } from "firebase/firestore"

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const {dispatch} = useAuthContext()

  const login = async (email, password) => {
    setError(null)
    setIsPending(true)

    // sign in
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)

      // change own online status in firestore
      const {uid} = res.user
      const ref = doc(db, 'users', uid)
      await updateDoc(ref, {
        online: true
      })

      // dispatch login action
      dispatch({type: 'LOGIN', payload: res.user})

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

  return {login, error, isPending}

}