import {db} from './db'
import {Collection} from '../types/Collection'
import {normalize, NormalizedSchema} from 'normalizr'
import {Session, sessionSchema} from '../types/Session'
import {Trainee, traineeSchema} from '../types/Trainee'

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

export const dbInsertTrainee = async (trainee: Omit<Trainee, 'id'>) => {
  return await db.collection(Collection.Trainee).add(trainee)
}

export const dbDeleteTrainee = async (traineeId: string) => {
  return await db
    .collection(Collection.Trainee)
    .doc(traineeId)
    .delete()
}

export const dbFetchTrainee = async (traineeId: string): Promise<Trainee> => {
  const dbTrainee = await db
    .collection(Collection.Trainee)
    .doc(traineeId)
    .get()

  if (!dbTrainee.exists) {
    throw new Error(`trainee with id ${traineeId} not found in db.`)
  }

  return {...dbTrainee.data(), id: dbTrainee.id} as Trainee
}

export const dbQueryTrainees = async (): Promise<{[key: string]: Trainee}> => {
  const querySnapshot = await db.collection(Collection.Trainee).get()

  return normalize(
    querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})),
    [traineeSchema]
  ).entities.trainee
}
