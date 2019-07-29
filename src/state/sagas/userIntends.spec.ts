import {all, put, takeEvery} from '@redux-saga/core/effects'
import pick from 'lodash/pick'
import {Page} from '../../types/page'
import {SessionBuilder, TraineeBuilder} from '../../__mocks__/store'
import {
  createAddTraineeIntend,
  createShowTraineeDetailsIntend,
  createShowTraineesIntend,
  UserIntend,
  createDeleteTraineeIntend,
} from '../intends/UserIntend'
import {
  createDeleteSessionsForTraineeAction,
  createFetchSessionsForTraineeAction,
  createSaveSessionForTraineeAction,
  SessionActions,
} from '../sessions/sessionActions'
import {
  createDeleteTraineeAction,
  createFetchTraineeAction,
  createFetchTraineesAction,
  createSaveTraineeAction,
  SaveTraineePayload,
} from '../trainees/traineeActions'
import {createUiNavigateAction} from '../ui/uiActions'
import {
  addSession,
  addTrainee,
  deleteTrainee,
  showTraineeDetails,
  showTrainees,
  userIntendSagas,
} from './userIntends'

describe('user intends', () => {
  test('user intend root', () => {
    const iterator = userIntendSagas()
    const {value} = iterator.next()
    expect(value).toEqual(
      all([
        takeEvery(UserIntend.ADD_TRAINEE, addTrainee),
        takeEvery(UserIntend.DELETE_TRAINEE, deleteTrainee),
        takeEvery(UserIntend.SHOW_TRAINEES, showTrainees),
        takeEvery(UserIntend.ADD_SESSION, addSession),
        takeEvery(UserIntend.SHOW_TRAINEE_DETAILS, showTraineeDetails),
      ])
    )

    expect(iterator.next().done).toBe(true)
  })

  test('add trainee intend', () => {
    const trainee = pick(
      new TraineeBuilder().build(),
      'name',
      'price'
    ) as SaveTraineePayload
    const addTraineePayload = createAddTraineeIntend(trainee)
    const iterator = addTrainee(addTraineePayload)
    let {value} = iterator.next()
    expect(value).toEqual(put(createSaveTraineeAction(trainee)))
    ;({value} = iterator.next())
    expect(value).toEqual(put(createShowTraineesIntend()))
    const {done} = iterator.next()
    expect(done).toBe(true)
  })

  test('show trainees intend', () => {
    const iterator = showTrainees()
    let {value} = iterator.next()
    expect(value).toEqual(put(createFetchTraineesAction()))
    ;({value} = iterator.next())
    expect(put(createUiNavigateAction(Page.Trainees)))
    const {done} = iterator.next()
    expect(done).toBe(true)
  })

  describe('show trainee details intend', () => {
    test('invalid payload', () => {
      const iterator = showTraineeDetails(
        createShowTraineeDetailsIntend(undefined!)
      )
      iterator.next()
      const {done} = iterator.next()
      expect(done).toBe(true)
    })

    test('valid payload', () => {
      const iterator = showTraineeDetails(
        createShowTraineeDetailsIntend('traineeId')
      )

      // it should fetch the relevant trainee data for display
      let {value} = iterator.next()
      expect(value).toEqual(put(createFetchTraineeAction('traineeId')))

      // it should fetch session data for the trainee
      ;({value} = iterator.next())
      expect(value).toEqual(
        put(createFetchSessionsForTraineeAction('traineeId'))
      )

      // it should navigate to the trainee details view
      ;({value} = iterator.next())
      expect(value).toEqual(
        put(createUiNavigateAction(Page.Trainee, {traineeId: 'traineeId'}))
      )

      const {done} = iterator.next()
      expect(done).toBe(true)
    })
  })

  test('add session intend', () => {
    const session = new SessionBuilder('traineeId').build()
    const iterator = addSession({
      type: SessionActions.INGEST_SESSION,
      payload: session,
      meta: {traineeId: 'traineeId'},
    })

    const {value} = iterator.next()
    expect(value).toEqual(
      put(createSaveSessionForTraineeAction('traineeId', session))
    )

    const {done} = iterator.next()
    expect(done).toBe(true)
  })

  test('delete trainee intend', () => {
    const iterator = deleteTrainee(createDeleteTraineeIntend('traineeId'))

    // it should delete trainee's sessions before deleting the actual trainee
    let {value} = iterator.next()
    expect(value).toEqual(
      put(createDeleteSessionsForTraineeAction('traineeId'))
    )

    // it should delete the trainee
    ;({value} = iterator.next())
    expect(value).toEqual(put(createDeleteTraineeAction('traineeId')))

    const {done} = iterator.next()
    expect(done).toBe(true)
  })
})
