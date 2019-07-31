import {db} from './db'
import {Collection} from '../types/Collection'
import {normalize} from 'normalizr'
import {Session, sessionSchema} from '../types/Session'

export const fetchSessionsForTrainee = async (traineeId: string) => {
  const querySnapshot = await db
    .collection(Collection.Session)
    .where('traineeRef', '==', traineeId)
    .get()

  return querySnapshot.docs.map(doc => ({...doc.data, id: doc.id})) as Session[]
}

export const fetchLatestSessionForTrainee = async (traineeId: string) => {
  const result: firebase.firestore.QuerySnapshot = await db
    .collection(Collection.Session)
    .where('traineeRef', '==', traineeId)
    .orderBy('datetime', 'asc')
    // .limit(1)
    .get()

  // await db
  //   .collection(Collection.Session)
  //   .where('traineeRef', '==', traineeId)
  //   .orderBy('datetime', 'desc')
  //   .limit(1)
  //   .get()

  const sessions: Session[] = result.docs.map(doc => {
    const docData = doc.data()
    return {
      ...docData,
      id: doc.id,
      datetime: (docData.datetime as firebase.firestore.Timestamp).toDate(),
    } as Session
  })

  return normalize(sessions, [sessionSchema])
}

export const insertSession = async (
  traineeId: string,
  session: Omit<Session, 'id' | 'traineeRef'>
) => {
  const doc = {
    ...session,
    traineeRef: traineeId,
  }

  return await db.collection(Collection.Session).add(doc)
}
