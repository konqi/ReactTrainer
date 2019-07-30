import {
  sessionSagas,
  saveSessionForTrainee,
  fetchTraineeSessions,
  deleteSessionsForTrainee,
  addSessionsToTrainee,
} from './sessionSagas'
import {takeEvery, all, call, put} from '@redux-saga/core/effects'
import {
  SessionActions,
  createDeleteSessionsForTraineeAction,
  createExpelSessionAction,
  createSaveSessionForTraineeAction,
  SaveSessionForTraineePayload,
  createIngestSessionAction,
} from '../sessions/sessionActions'
import {SessionBuilder} from '../../__mocks__/store'
import {query, BatchBuilder} from '../../data'
import {Collection} from '../../types/Collection'
import {insertSession} from '../../data/Queries'
import {createAddTraineeAction} from '../trainees'

jest.mock('../../data/db')
jest.mock('../../data/BatchBuilder')

test('sessions root saga', () => {
  expect(sessionSagas().next().value).toEqual(
    all([
      takeEvery(SessionActions.SAVE_SESSION_FOR_TRAINEE, saveSessionForTrainee),
      takeEvery(
        SessionActions.FETCH_SESSIONS_FOR_TRAINEE,
        fetchTraineeSessions
      ),
      takeEvery(
        SessionActions.DELETE_SESSIONS_FOR_TRAINEE,
        deleteSessionsForTrainee
      ),
    ])
  )
})

test('deleteSessionsForTrainee', () => {
  const iterator = deleteSessionsForTrainee(
    createDeleteSessionsForTraineeAction('traineeId')
  )

  // should fetch list of trainee sessions
  let {value} = iterator.next()
  expect(value).toEqual(call(query.fetchSessionsForTrainee, 'traineeId'))

  // should invoke batch delete
  ;({value} = iterator.next([new SessionBuilder('traineeId').build()]))
  expect(value).toEqual(call([new BatchBuilder(), 'execute']))

  expect(new BatchBuilder().delete).toHaveBeenCalledWith(
    Collection.Session,
    'sessionId'
  )
  ;({value} = iterator.next())
  expect(value).toEqual(put(createExpelSessionAction('sessionId')))

  const {done} = iterator.next()

  expect(done).toBe(true)
})

// TODO: test error during saga

test('saveSessionForTrainee', () => {
  const newSession = new SessionBuilder('traineeId').build()
  const action = createSaveSessionForTraineeAction('traineeId', newSession)

  const iterator = saveSessionForTrainee(action)

  // it should insert session into database
  let {value} = iterator.next()
  expect(value).toEqual(call(insertSession, 'traineeId', newSession))

  // it should ingest the saved session into the store
  ;({value} = iterator.next({id: 'testSessionId'}))
  expect(value).toEqual(
    put(createIngestSessionAction({...newSession, id: 'testSessionId'}))
  )

  // it should add the sessionId to the trainee entity
  ;({value} = iterator.next())
  expect(value).toEqual(
    call(addSessionsToTrainee, 'traineeId', [
      {
        ...newSession,
        id: 'testSessionId',
      },
    ])
  )

  const {done} = iterator.next()
  expect(done).toBe(true)
})
test('fetchTraineeSessions', () => {})
test('addSessionsToTrainee', () => {})
