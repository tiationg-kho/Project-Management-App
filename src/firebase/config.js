import { initializeApp } from 'firebase/app'
import { getFirestore, Timestamp } from 'firebase/firestore'
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: "thedojo-565e6.firebaseapp.com",
  projectId: "thedojo-565e6",
  storageBucket: "thedojo-565e6.appspot.com",
  messagingSenderId: "948693697778",
  appId: process.env.REACT_APP_APPID
}

// init
const app = initializeApp(firebaseConfig)

// init services
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

// timestamp
const timestamp = Timestamp

export { db, auth, storage, timestamp }
