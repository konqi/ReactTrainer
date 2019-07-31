import {all, call, put, select, takeEvery} from '@redux-saga/core/effects'
import {NormalizedSchema} from 'normalizr'
import {ApplicationState} from '..'
import {BatchBuilder, query} from '../../data'
import {db} from '../../data/db'
import {fetchLatestSessionForTrainee, insertSession} from '../../data/Queries'
import {Collection} from '../../types/Collection'
import {Session} from '../../types/Session'
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
import {selectTraineeById} from '../selectors'

export function* sessionSagas() {
  yield all([
    takeEvery(SessionActions.SAVE_SESSION_FOR_TRAINEE, saveSessionForTrainee),
    takeEvery(SessionActions.FETCH_SESSIONS_FOR_TRAINEE, fetchTraineeSessions),
    takeEvery(
      SessionActions.DELETE_SESSIONS_FOR_TRAINEE,
      deleteSessionsForTrainee
    ),
  ])
}

export function* deleteSessionsForTrainee(action: DeleteSessionsForTraineeFSA) {
  try {
    const sessions: Session[] = yield call(
      query.fetchSessionsForTrainee,
      action.payload!
    )
    const deletedSessionIds: string[] = []

    const batch = new BatchBuilder()
    sessions.forEach(session => {
      deletedSessionIds.push(session.id)
      batch.delete(Collection.Session, session.id)
    })
    yield call([batch, 'execute'])
    // expel sessions from store
    yield put(createExpelSessionAction(...deletedSessionIds))
  } catch (e) {
    console.error(e)
  }
}

export function* saveSessionForTrainee(action: SaveSessionForTraineeFSA) {
  try {
    if (!action.payload) {
      throw new Error('action is missing required property: payload')
    }
    if (!action.meta || !action.meta.traineeId) {
      throw new Error('action missing required property: meta.traineeId')
    }
    const doc = {
      ...action.payload,
      traineeRef: action.meta!.traineeId,
    }

    const {id} = yield call(
      insertSession,
      action.meta!.traineeId,
      action.payload
    )

    const session: Session = {...doc, id}
    yield put(createIngestSessionAction(session))
    yield call(addSessionsToTrainee, action.meta!.traineeId, session)
  } catch (e) {
    console.error(e)
    // yield some error
  }
}

type SessionsById = {[key: string]: Session}
export function* fetchTraineeSessions(action: ShowTraineeDetailsIntendFSA) {
  try {
    if (!action.payload) {
      throw new Error('action is missing property: payload')
    }
    const normalizedSessions: NormalizedSchema<
      {session: SessionsById},
      string
    > = yield call(fetchLatestSessionForTrainee, action.payload)
    if (typeof normalizedSessions.entities.session === 'undefined') {
      return
    }
    yield put(createIngestSessionsAction(normalizedSessions.entities.session))
    // add sessions to trainees
    yield call(
      addSessionsToTrainee,
      action.payload!,
      ...Object.values(normalizedSessions.entities.session!)
    )
  } catch (e) {
    console.error(e)
    // yield some error?
  }
}

export function* addSessionsToTrainee(
  traineeId: string,
  ...sessions: Session[]
) {
  try {
    const trainee: Trainee = yield select(selectTraineeById, traineeId)
    if (!trainee) {
      throw new Error('trainee not in store')
    }
    trainee.sessionsRef = [
      ...(trainee.sessionsRef || []),
      ...sessions.map(session => session.id),
    ]
    yield put(createAddTraineeAction(trainee))
  } catch (e) {
    console.error(e)
  }
}
