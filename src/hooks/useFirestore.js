import { useReducer, useEffect, useState } from "react"
import { collection, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore"
import { db, timestamp } from "../firebase/config"

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null
}

const firestoreReducer = (state, action) => {
  switch (action.type) {

    case 'IS_PENDING':
      return {isPending: true, document: null, success: false, error: null}

    case 'ADDED_DOCUMENT':
      return {isPending: false, document: action.payload, success: true, error: null}

    case 'DELETED_DOCUMENT':
      return {isPending: false, document: null, success: true, error: null}

    case 'UPDATED_DOCUMENT':
      return {isPending: false, document: null, success: true, error: null}

    case 'ERROR':
      return {isPending: false, document: null, success: false, error: action.payload}

    default:
      return state
  }
}

export const useFirestore = (collectionString) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState)
  const [isCancelled, setIsCancelled] = useState(false)

  // element ref
  const ref = collection(db, collectionString)

  // only dispatch is not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action)
    }
  }

  // add document
  const addDocument = async (doc) => {
    dispatch({type: 'IS_PENDING'})

    try {
      const createAt = timestamp.fromDate(new Date())
      const addedDocument = await addDoc(ref, {...doc, createAt})
      dispatchIfNotCancelled({type: 'ADDED_DOCUMENT', payload: addedDocument})

    } catch (error) {
      dispatchIfNotCancelled({type: 'ERROR', payload: error})

    }
  }

  // delete document
  const deleteDocument = async (id) => {
    dispatch({type: 'IS_PENDING'})

    try {
      const docRef = doc(db, collectionString, id)
      await deleteDoc(docRef)

      dispatchIfNotCancelled({type: 'DELETED_DOCUMENT'})

    } catch (error) {
      dispatchIfNotCancelled({type: 'ERROR', payload: 'could not delete'})

    }
  }

  // update document
  const updateDocument = async (id, updates) => {
    dispatch({type: 'IS_PENDING'})

    try {
      const docRef = doc(db, collectionString, id)
      await updateDoc(docRef, updates)
      dispatchIfNotCancelled({type: 'UPDATED_DOCUMENT'})

    } catch (error) {
      dispatchIfNotCancelled({type: 'ERROR', payload: 'could not update'})
    }

  }

  // return clean up
  useEffect(() => () => setIsCancelled(true), [])

  return {addDocument, deleteDocument, updateDocument, response}

}