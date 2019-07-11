import { call, put, takeEvery } from '@redux-saga/core/effects';
import { normalize } from 'normalizr';
import { db, DbCollection } from '../../db';
import { Session, sessionSchema } from '../../types/Session';
import { AddTrainingIntendFSA, ShowTraineeDetailsIntendFSA, UserIntend } from '../intends/UserIntend';
import { createAddSessionAction, createAddSessionsAction } from '../sessions/sessionActions';

export function* sessionSagas() {
  yield takeEvery(UserIntend.ADD_SESSION, addSession)
  yield takeEvery(UserIntend.SHOW_TRAINEE_DETAILS, fetchTraineeSessions)
}

function* addSession(action: AddTrainingIntendFSA) {
  if (action.payload && action.meta && action.meta.traineeId) {
    try {
      const doc = {
        ...action.payload,
        traineeRef: action.meta!.traineeId,
      }
      const { id } = yield call(() =>
        db.collection(DbCollection.Session).add(doc)
      )

      const session: Session = { ...doc, id }
      yield put(createAddSessionAction(session))
    } catch (e) {
      console.error(e)
      // yield some error
    }
  }
}

function* fetchTraineeSessions(action: ShowTraineeDetailsIntendFSA) {
  if (action.payload) {
    try {
      const normalizedSessions = yield call(fetchLatestSessionForTrainee, action.payload)
      yield put(createAddSessionsAction(normalizedSessions))
      // TODO add sessions to trainees
    } catch (e) {
      console.error(e)
      // yield some error
    }
  }
}

async function fetchLatestSessionForTrainee(traineeId: string) {
  const result: firebase.firestore.QuerySnapshot = await
    db
      .collection(DbCollection.Session)
      .where('traineeRef', '==', traineeId)
      .where('datetime', '<', new Date())
      .orderBy('datetime')
      .limit(1)
      .get()
  const sessions: Session[] = result.docs.map(
    doc =>
      ({
        ...doc.data(),
        id: doc.id,
      } as Session)
  )

  return normalize(sessions, [sessionSchema])
}
