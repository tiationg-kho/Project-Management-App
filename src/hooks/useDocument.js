import { db } from "../firebase/config"

import {useState, useEffect} from 'react'
import { doc, onSnapshot } from "firebase/firestore"

export const useDocument = (collectionString, id) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)

  // realtime data for document
  useEffect(() => {
    const ref = doc(db, collectionString, id)
    
    const unsub = onSnapshot(ref, (snapshot) => {

      if (snapshot.data()) {
        setDocument({...snapshot.data(), id: snapshot.id})
        setError(null)
      } else {
        setError('no document exists')
      }

     }, (error => {
       console.log(error)
       setError('counld not fetch the data')
     }))

    return () => unsub()


  }, [collectionString, id])

  return {document, error}

}