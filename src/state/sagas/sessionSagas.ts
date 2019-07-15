import {call, put, takeEvery, select} from '@redux-saga/core/effects'
import {normalize, NormalizedSchema} from 'normalizr'
import {db, DbCollection} from '../../db'
import {Session, sessionSchema} from '../../types/Session'
import {
  AddTrainingIntendFSA,
  ShowTraineeDetailsIntendFSA,
  UserIntend,
} from '../intends/UserIntend'
import {
  createAddSessionAction,
  createAddSessionsAction,
  AddSessionsPayload,
  AddSessionPayload,
} from '../sessions/sessionActions'
import {ApplicationState} from '..'
import {Trainee} from '../../types/Trainee'
import {createAddTraineeAction} from '../trainees'

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
      const {id} = yield call(() =>
        db.collection(DbCollection.Session).add(doc)
      )

      const session: Session = {...doc, id}
      yield put(createAddSessionAction(session))
      yield addSessionsToTrainee(action.meta!.traineeId, [session])
    } catch (e) {
      console.error(e)
      // yield some error
    }
  }
}

type SessionsById = {[key: string]: Session}
function* fetchTraineeSessions(action: ShowTraineeDetailsIntendFSA) {
  if (action.payload) {
    try {
      const normalizedSessions: NormalizedSchema<
        {session: SessionsById},
        string
      > = yield call(fetchLatestSessionForTrainee, action.payload)
      if (typeof normalizedSessions.entities.session === 'undefined') {
        return
      }
      yield put(createAddSessionsAction(normalizedSessions.entities.session))
      // add sessions to trainees
      yield addSessionsToTrainee(
        action.payload!,
        Object.values(normalizedSessions.entities.session!)
      )
    } catch (e) {
      console.error(e)
      // yield some error
    }
  }
}

function* addSessionsToTrainee(traineeId: string, sessions: Session[]) {
  const trainee: Trainee = yield select(
    (state: ApplicationState) => state.trainees[traineeId]
  )
  trainee.sessionsRef = [
    ...(trainee.sessionsRef || []),
    ...sessions.map(session => session.id),
  ]
  yield put(createAddTraineeAction(trainee))
}

async function fetchLatestSessionForTrainee(traineeId: string) {
  const result: firebase.firestore.QuerySnapshot = await db
    .collection(DbCollection.Session)
    .where('traineeRef', '==', traineeId)
    .where('datetime', '<', new Date())
    .orderBy('datetime')
    .limit(1)
    .get()

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
