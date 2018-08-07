import firebase from 'firebase'

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

const firebaseApp = firebase.initializeApp(config)
const db = firebaseApp.database()
export const dbItemsRef = db.ref('user-data')
