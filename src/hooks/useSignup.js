import { useState, useEffect } from "react"
import { db, auth, storage } from "../firebase/config"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import { useAuthContext } from "./useAuthContext"

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const {dispatch} = useAuthContext()

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null)
    setIsPending(true)
    try {
      // signup
      const res = await createUserWithEmailAndPassword(auth, email, password)

      if (!res){
        throw new Error('signup fail')
      }

      // upload user thumbnail to storage
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`
      const storageRef = ref(storage, uploadPath)
      await uploadBytes(storageRef, thumbnail)
      const imgURL = await getDownloadURL(storageRef)

      // add displayName and thumbnail url to user
      await updateProfile(res.user, {displayName, photoURL: imgURL})

      // create user document in friestore
      const docRef = doc(db, 'users', res.user.uid)
      await setDoc(docRef, {
        online: true,
        displayName,
        photoURL: imgURL
      })

      // dispatch login action
      dispatch({type: 'LOGIN', payload: res.user})

      // update state
      if (!isCancelled){
        setIsPending(false)
        setError(null)
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


  return {error, isPending, signup}

}