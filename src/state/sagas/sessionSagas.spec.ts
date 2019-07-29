import {
  sessionSagas,
  saveSessionForTrainee,
  fetchTraineeSessions,
  deleteSessionsForTrainee,
} from './sessionSagas'
import {takeEvery, all, call} from '@redux-saga/core/effects'
import {
  SessionActions,
  createDeleteSessionsForTraineeAction,
} from '../sessions/sessionActions'
import {fetchSessionsForTrainee} from '../../db'
import {SessionBuilder} from '../../__mocks__/store'

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

  let {value} = iterator.next()
  expect(value).toEqual(call(fetchSessionsForTrainee, 'traineeId'))
  ;({value} = iterator.next([new SessionBuilder('traineeId').build()]))
  // expect(value).toEqual()
  console.log(value)
})

test('saveSessionForTrainee', () => {})
test('fetchTraineeSessions', () => {})
test('addSessionsToTrainee', () => {})
