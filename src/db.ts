import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import {Session} from './types/Session'

export enum DbCollection {
  Trainee = 'trainee',
  Session = 'session',
}

var firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()

// const authProvider = new firebase.auth.GoogleAuthProvider()
// export const auth = async () => {
//   const {credential} = await firebase.auth().getRedirectResult()
//   if (credential) {
//     return credential
//   } else {
//     firebase.auth().signInWithRedirect(authProvider)
//   }
// }

export const fetchSessionsForTrainee = async (traineeId: string) => {
  const querySnapshot = await db
    .collection(DbCollection.Session)
    .where('traineeRef', '==', traineeId)
    .get()

  return querySnapshot.docs.map(doc => ({...doc.data, id: doc.id})) as Session[]
}

export class BatchBuilder {
  batch: firebase.firestore.WriteBatch

  constructor() {
    this.batch = db.batch()
  }

  delete(collection: DbCollection, id: string) {
    this.batch.delete(db.collection(collection).doc(id))
    return this
  }

  async execute() {
    return await this.batch.commit()
  }
}
