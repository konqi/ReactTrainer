import {call, put, select, takeEvery} from '@redux-saga/core/effects'
import {normalize, NormalizedSchema} from 'normalizr'
import {ApplicationState} from '..'
import {db, DbCollection} from '../../db'
import {Session, sessionSchema} from '../../types/Session'
import {Trainee} from '../../types/Trainee'
import {ShowTraineeDetailsIntendFSA} from '../intends/UserIntend'
import {
  createExpelSessionAction,
  createIngestSessionAction,
  createIngestSessionsAction,
  DeleteSessionsForTraineeFSA,
  SaveSessionForTraineeFSA,
  SessionActions,
} from '../sessions/sessionActions'
import {createAddTraineeAction} from '../trainees'

export function* sessionSagas() {
  yield takeEvery(
    SessionActions.SAVE_SESSION_FOR_TRAINEE,
    saveSessionForTrainee
  )
  // yield takeEvery(UserIntend.SHOW_TRAINEE_DETAILS, fetchTraineeSessions)
  yield takeEvery(
    SessionActions.FETCH_SESSIONS_FOR_TRAINEE,
    fetchTraineeSessions
  )
  yield takeEvery(
    SessionActions.DELETE_SESSIONS_FOR_TRAINEE,
    deleteSessionsForTrainee
  )
}

function* deleteSessionsForTrainee(action: DeleteSessionsForTraineeFSA) {
  try {
    const querySnapshot: firebase.firestore.QuerySnapshot = yield call(() =>
      db
        .collection(DbCollection.Session)
        .where('traineeRef', '==', action.payload!)
        .get()
    )
    const sessionIdsToDelete: string[] = []
    const batch = db.batch()
    querySnapshot.forEach(doc => {
      sessionIdsToDelete.push(doc.id)
      batch.delete(doc.ref)
    })
    yield call(() => batch.commit())
    // expel sessions from store
    yield put(createExpelSessionAction(...sessionIdsToDelete))
  } catch (e) {
    console.error(e)
  }
}

function* saveSessionForTrainee(action: SaveSessionForTraineeFSA) {
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
      yield put(createIngestSessionAction(session))
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
      yield put(createIngestSessionsAction(normalizedSessions.entities.session))
      // add sessions to trainees
      yield addSessionsToTrainee(
        action.payload!,
        Object.values(normalizedSessions.entities.session!)
      )
    } catch (e) {
      console.error(e)
      // yield some error?
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
    .orderBy('datetime')
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
