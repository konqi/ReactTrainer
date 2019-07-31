import {
  sessionSagas,
  saveSessionForTrainee,
  fetchTraineeSessions,
  deleteSessionsForTrainee,
  addSessionsToTrainee,
} from './sessionSagas'
import {takeEvery, all, call, put, select} from '@redux-saga/core/effects'
import {
  SessionActions,
  createDeleteSessionsForTraineeAction,
  createExpelSessionAction,
  createSaveSessionForTraineeAction,
  createIngestSessionAction,
  createIngestSessionsAction,
} from '../sessions/sessionActions'
import {SessionBuilder, TraineeBuilder} from '../../__mocks__/store'
import {query, BatchBuilder} from '../../data'
import {Collection} from '../../types/Collection'
import {insertSession, fetchLatestSessionForTrainee} from '../../data/Queries'
import {createAddTraineeAction} from '../trainees'
import {createShowTraineeDetailsIntend} from '../intends/UserIntend'
import {selectTraineeById} from '../selectors'

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

describe('deleteSessionsForTrainee', () => {
  test('successful delete', () => {
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

  test('error during saga', () => {
    const iterator = deleteSessionsForTrainee(
      createDeleteSessionsForTraineeAction('traineeId')
    )

    // should fetch list of trainee sessions
    let {value} = iterator.next()
    expect(value).toEqual(call(query.fetchSessionsForTrainee, 'traineeId'))

    const spy = jest.spyOn(console, 'error').mockImplementation(jest.fn())
      // should fail invoke batch delete
    ;({value} = iterator.next(undefined))
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()

    const {done} = iterator.next()
    expect(done).toBe(true)
  })
})

describe('saveSessionForTrainee', () => {
  test('missing parameters', () => {
    // @ts-ignore
    const action = createSaveSessionForTraineeAction(undefined, undefined)
    const iterator = saveSessionForTrainee(action)

    const spy = jest.spyOn(console, 'error').mockImplementation(jest.fn())
    // should fail
    const {done} = iterator.next(undefined)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()

    expect(done).toBe(true)
  })

  test('successful save', () => {
    const newSession = new SessionBuilder('traineeId').build()
    const action = createSaveSessionForTraineeAction('traineeId', newSession)

    const iterator = saveSessionForTrainee(action)

    // should insert session into database
    let {value} = iterator.next()
    expect(value).toEqual(call(insertSession, 'traineeId', newSession))

    // should ingest the saved session into the store
    ;({value} = iterator.next({id: 'testSessionId'}))
    expect(value).toEqual(
      put(createIngestSessionAction({...newSession, id: 'testSessionId'}))
    )

    // should add the sessionId to the trainee entity
    ;({value} = iterator.next())
    expect(value).toEqual(
      call(addSessionsToTrainee, 'traineeId', {
        ...newSession,
        id: 'testSessionId',
      })
    )

    const {done} = iterator.next()
    expect(done).toBe(true)
  })

  test('error during save', () => {
    const newSession = new SessionBuilder('traineeId').build()
    const action = createSaveSessionForTraineeAction('traineeId', newSession)

    const iterator = saveSessionForTrainee(action)

    // should insert session into database
    let {value} = iterator.next()
    expect(value).toEqual(call(insertSession, 'traineeId', newSession))

    // should ingest the saved session into the store
    const spy = jest.spyOn(console, 'error').mockImplementation(jest.fn())
    ;({value} = iterator.next(undefined))
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()

    const {done} = iterator.next()
    expect(done).toBe(true)
  })
})

describe('fetchTraineeSessions', () => {
  test('missing parameters', () => {
    // @ts-ignore
    const action = createShowTraineeDetailsIntend(undefined)
    const iterator = fetchTraineeSessions(action)

    const spy = jest.spyOn(console, 'error').mockImplementation(jest.fn())
    // should fail
    const {done} = iterator.next(undefined)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()

    expect(done).toBe(true)
  })

  test('successful fetch', () => {
    const session = new SessionBuilder('traineeId').build()
    const action = createShowTraineeDetailsIntend('traineeId')
    const iterator = fetchTraineeSessions(action)

    // should fetch trainee sessions
    let {value} = iterator.next()
    expect(value).toEqual(call(fetchLatestSessionForTrainee, 'traineeId'))

    // should add sessions to store
    ;({value} = iterator.next({entities: {session: {[session.id]: session}}}))
    expect(value).toEqual(
      put(createIngestSessionsAction({[session.id]: session}))
    )

    // should update session references of trainee
    ;({value} = iterator.next())
    expect(value).toEqual(call(addSessionsToTrainee, 'traineeId', session))

    // should be done
    const {done} = iterator.next()
    expect(done).toBe(true)
  })

  test('error during saga', () => {
    const action = createShowTraineeDetailsIntend('traineeId')
    const iterator = fetchTraineeSessions(action)

    // should fetch trainee sessions
    let {value} = iterator.next()
    expect(value).toEqual(call(fetchLatestSessionForTrainee, 'traineeId'))

    // should fail
    const spy = jest.spyOn(console, 'error').mockImplementation(jest.fn())
    const {done} = iterator.next(undefined)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()

    expect(done).toBe(true)
  })
})

describe('addSessionsToTrainee', () => {
  test('successfully add sessions to trainee', () => {
    const session = new SessionBuilder('traineeId').build()
    const trainee = new TraineeBuilder().build()
    const iterator = addSessionsToTrainee('traineeId', session)

    // should select the trainee from store
    let {value} = iterator.next()
    expect(value).toEqual(select(selectTraineeById, 'traineeId'))

    // should add session ref to trainee in store
    ;({value} = iterator.next(trainee))
    expect(value).toEqual(
      put(createAddTraineeAction({...trainee, sessionsRef: [session.id]}))
    )

    // should be done
    const {done} = iterator.next()
    expect(done).toBe(true)
  })

  test('trainee not in store', () => {
    const session = new SessionBuilder('traineeId').build()
    const iterator = addSessionsToTrainee('traineeId', session)

    // should select the trainee from store
    let {value} = iterator.next()
    expect(value).toEqual(select(selectTraineeById, 'traineeId'))

    // should fail
    const spy = jest.spyOn(console, 'error').mockImplementation(jest.fn())
    const {done} = iterator.next(undefined)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()

    expect(done).toBe(true)
  })
})
