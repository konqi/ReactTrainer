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
  if (action.payload && action.meta && action.meta.traineeId) {
    try {
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
}

type SessionsById = {[key: string]: Session}
export function* fetchTraineeSessions(action: ShowTraineeDetailsIntendFSA) {
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
}

export function* addSessionsToTrainee(
  traineeId: string,
  ...sessions: Session[]
) {
  const trainee: Trainee = yield select(selectTraineeById, traineeId)
  trainee.sessionsRef = [
    ...(trainee.sessionsRef || []),
    ...sessions.map(session => session.id),
  ]
  yield put(createAddTraineeAction(trainee))
}

export const selectTraineeById = (state: ApplicationState, traineeId: string) =>
  state.trainees[traineeId]
