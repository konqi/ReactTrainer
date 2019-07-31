import {call, put, all, takeEvery} from '@redux-saga/core/effects'
import {
  traineeSagas,
  fetchTrainees,
  saveTrainee,
  deleteTrainee,
  fetchTrainee,
} from './traineeSagas'
import {TraineeActions} from '../trainees'

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
  test('missing payload', () => {})
  test('successful save', () => {})
  test('error during save', () => {})
})
describe('deleteTrainee', () => {
  test('successful delete', () => {})
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
