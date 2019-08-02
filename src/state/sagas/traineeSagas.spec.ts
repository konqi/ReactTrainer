import {call, put, all, takeEvery} from '@redux-saga/core/effects'
import {
  traineeSagas,
  fetchTrainees,
  saveTrainee,
  deleteTrainee,
  fetchTrainee,
} from './traineeSagas'
import {TraineeActions, createAddTraineeAction} from '../trainees'
import {
  createSaveTraineeAction,
  createDeleteTraineeAction,
  createExpelTraineeAction,
} from '../trainees/traineeActions'
import {TraineeBuilder} from '../../__mocks__/store'
import {dbInsertTrainee, dbDeleteTrainee} from '../../data/Queries'
import {createExpelSessionAction} from '../sessions/sessionActions'

test('trainee root saga', () => {
  const iterator = traineeSagas()
  const {value} = iterator.next()
  expect(value).toEqual(
    all([
      takeEvery(TraineeActions.FETCH_TRAINEES, fetchTrainees),
      takeEvery(TraineeActions.SAVE_TRAINEE, saveTrainee),
      takeEvery(TraineeActions.DELETE_TRAINEE, deleteTrainee),
      takeEvery(TraineeActions.FETCH_TRAINEE, fetchTrainee),
    ])
  )

  const {done} = iterator.next()
  expect(done).toBe(true)
})

describe('saveTrainee', () => {
  test('successful save', () => {
    const trainee = new TraineeBuilder().build()
    const iterator = saveTrainee(createSaveTraineeAction(trainee))

    // call db insert operation
    let {value} = iterator.next()
    expect(value).toEqual(call(dbInsertTrainee, trainee))

    // add trainee to store
    ;({value} = iterator.next({id: 'newTraineeId'}))
    expect(value).toEqual(
      put(createAddTraineeAction({...trainee, id: 'newTraineeId'}))
    )

    // should be done
    const {done} = iterator.next()
    expect(done).toBe(true)
  })

  test('missing payload', () => {
    // @ts-ignore
    const iterator = saveTrainee(createSaveTraineeAction())

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn())
    const {done} = iterator.next()
    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()

    expect(done).toBe(true)
  })

  test('error during save', () => {
    const trainee = new TraineeBuilder().build()
    const iterator = saveTrainee(createSaveTraineeAction(trainee))

    // call db insert operation
    let {value} = iterator.next()
    expect(value).toEqual(call(dbInsertTrainee, trainee))

    // add trainee to store
    const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(jest.fn())

      // fails because id is missing from result
    ;({value} = iterator.next())
    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()

    // should be done
    const {done} = iterator.next()
    expect(done).toBe(true)
  })
})
describe('deleteTrainee', () => {
  test('successful delete', () => {
    const iterator = deleteTrainee(createDeleteTraineeAction('traineeId'))

    // call db delete operation
    let {value} = iterator.next()
    expect(value).toEqual(call(dbDeleteTrainee, 'traineeId'))

    // remove trainee from store
    ;({value} = iterator.next())
    expect(value).toEqual(put(createExpelTraineeAction('traineeId')))

    const {done} = iterator.next()
    expect(done).toBe(true)
  })
})
describe('fetchTrainee', () => {
  test('missing parameters', () => {})
  test('fetch error, no such trainee', () => {})
  test('successful fetch', () => {})
})
describe('fetchTrainees', () => {
  test('no trainees in db', () => {})
  test('successful fetch', () => {})
})
