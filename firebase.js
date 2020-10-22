import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// Initializing firebase 
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FB_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DB_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGE_SENDER_ID,
  appId: process.env.VUE_APP_FB_APP_ID
};

console.log(firebaseConfig)
firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
const auth = firebase.auth()

const usersCollection = db.collection('users')
const asteroidsCollection = db.collection('asteroids')

export {
  db,
  auth,
  usersCollection,
  asteroidsCollection
}