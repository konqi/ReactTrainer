import {call, put, all, takeEvery} from '@redux-saga/core/effects'
import {Trainee} from '../../types/Trainee'
import {createAddTraineeAction} from '../trainees'
import {
  createExpelTraineeAction,
  createIngestTraineesAction,
  DeleteTraineeFSA,
  SaveTraineeFSA,
  TraineeActions,
  FetchTraineeFSA,
} from '../trainees/traineeActions'
import {
  dbInsertTrainee,
  dbDeleteTrainee,
  dbFetchTrainee,
  dbQueryTrainees,
} from '../../data/Queries'

export function* traineeSagas() {
  yield all([
    takeEvery(TraineeActions.FETCH_TRAINEES, fetchTrainees),
    takeEvery(TraineeActions.SAVE_TRAINEE, saveTrainee),
    takeEvery(TraineeActions.DELETE_TRAINEE, deleteTrainee),
    takeEvery(TraineeActions.FETCH_TRAINEE, fetchTrainee),
  ])
}

export function* saveTrainee(action: SaveTraineeFSA) {
  try {
    if (!action.payload) {
      throw new Error('action is missing required property: payload')
    }
    const {id} = yield call(dbInsertTrainee, action.payload!)

    const trainee: Trainee = {...action.payload!, id}
    yield put(createAddTraineeAction(trainee))
  } catch (e) {
    console.error(e)
    // yield some error
  }
}

export function* deleteTrainee(action: DeleteTraineeFSA) {
  try {
    yield call(dbDeleteTrainee, action.payload!)
    // expel trainee from store
    yield put(createExpelTraineeAction(action.payload!))
  } catch (e) {
    console.error('could not delete trainee', e)
  }
}

export function* fetchTrainee(action: FetchTraineeFSA) {
  try {
    const traineeId = action.payload
    if (!traineeId) {
      throw new Error('action missing required property: payload')
    }

    const trainee: Trainee = yield call(dbFetchTrainee, traineeId)

    yield put(
      createIngestTraineesAction({
        [trainee.id]: trainee,
      })
    )
  } catch (e) {
    console.error(e)
    // yield some error
  }
}

export function* fetchTrainees() {
  try {
    const traineesById: {[key: string]: Trainee} = yield call(dbQueryTrainees)

    yield put(createIngestTraineesAction(traineesById))
  } catch (e) {
    console.error(e)
    // yield some error
  }
}
