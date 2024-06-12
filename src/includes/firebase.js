import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

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
const usersCollection = db.collection('users')

export { auth, db, usersCollection }
