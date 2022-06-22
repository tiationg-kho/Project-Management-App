import { useEffect, useState, useRef } from "react"
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore"
import { db } from "../firebase/config"

export const useCollection = (collection_string, _query_array, _order_array) => {
  const [documents, setDocuments] = useState(null)
  const [error, setError] = useState(null)
  
  // avoid infinite loop in useEffect
  const query_array = useRef(_query_array).current
  const order_array = useRef(_order_array).current

  useEffect(() => {
    let ref = collection(db, collection_string)

    if (query_array) {
      ref = query(ref, where(...query_array))
    }

    if (order_array) {
      ref = query(ref, orderBy(...order_array))
    }

    const unsub = onSnapshot(ref, (snapshot) => {
      let res = []
      snapshot.docs.forEach(doc => {
        res.push({...doc.data(), id: doc.id})
      })

      setDocuments(res)
      setError(null)

     }, (error => {
       console.log(error)
       setError('counld not fetch the data')
     }))

     return () => unsub()

  }, [collection_string, query_array, order_array])

  return {documents, error}

}