import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDUL9-MtxggxQN7i_hmTsEsJLWQHesmjus',
  authDomain: 'quran-now-3928b.firebaseapp.com',
  projectId: 'quran-now-3928b',
  storageBucket: 'quran-now-3928b.appspot.com',
  messagingSenderId: '850650338611',
  appId: '1:850650338611:web:84ce1e1d44807f2e7fda46'
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

const usersCollection = db.collection('users')
const tracksCollection = db.collection('tracks')
const commentsCollection = db.collection('comments')

export { auth, db, storage, usersCollection, tracksCollection, commentsCollection }
