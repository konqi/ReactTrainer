import {call, put, takeEvery} from '@redux-saga/core/effects'
import {normalize} from 'normalizr'
import {db, DbCollection} from '../../db'
import {Trainee, traineeSchema} from '../../types/Trainee'
import {createAddTraineeAction} from '../trainees'
import {
  createExpelTraineeAction,
  createIngestTraineesAction,
  DeleteTraineeFSA,
  SaveTraineeFSA,
  TraineeActions,
} from '../trainees/traineeActions'

export function* traineeSagas() {
  yield takeEvery(TraineeActions.FETCH_TRAINEES, fetchTrainees)
  // yield takeEvery(TraineeActions.FETCH_TRAINEE, fetchTrainee)
  yield takeEvery(TraineeActions.SAVE_TRAINEE, saveTrainee)
  yield takeEvery(TraineeActions.DELETE_TRAINEE, deleteTrainee)
}

function* saveTrainee(action: SaveTraineeFSA) {
  if (action.payload) {
    try {
      const {id} = yield call(() =>
        db.collection(DbCollection.Trainee).add(action.payload!)
      )

      const trainee: Trainee = {...action.payload!, id}
      yield put(createAddTraineeAction(trainee))
    } catch (e) {
      console.error(e)
      // yield some error
    }
  }
}

function* deleteTrainee(action: DeleteTraineeFSA) {
  try {
    yield call(() =>
      db
        .collection(DbCollection.Trainee)
        .doc(action.payload!)
        .delete()
    )
    // expel trainee from store
    yield put(createExpelTraineeAction(action.payload!))
  } catch (e) {
    console.error('could not delete trainee', e)
  }
}

// function* fetchTrainee(traineeId: String) {
//   yield console.log('foo')
// }

function* fetchTrainees() {
  try {
    const trainees: firebase.firestore.QuerySnapshot = yield db
      .collection(DbCollection.Trainee)
      .get()

    const normalizedTrainees = normalize(
      trainees.docs.map(doc => ({...doc.data(), id: doc.id})),
      [traineeSchema]
    )

    yield put(createIngestTraineesAction(normalizedTrainees.entities.trainee))
  } catch (e) {
    console.error(e)
    // yield some error
  }
}
