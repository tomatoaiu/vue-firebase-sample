import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

declare const process: {
  env: {
    NODE_ENV: string,
    APIKEY: string,
    AUTHDOMAIN: string,
    DATABASEURL: string,
    PROJECTID: string,
    STORAGEBUCKET: string,
    MESSAGINGSENDERID: string
  }
}

const config = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID
}

const firebaseApps = !firebase.apps.length ? firebase.initializeApp(config) : firebase.app()
const db = firebaseApps.database()
const auth = firebaseApps.auth();

export {
  firebaseApps,
  db,
  auth
}
