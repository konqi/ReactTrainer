import {call, put, takeEvery} from '@redux-saga/core/effects'
import {normalize, schema} from 'normalizr'
import {db, DbCollection} from '../../db'
import {Trainee, traineeSchema} from '../../types/Trainee'
import {
  AddTraineeIntendFSA,
  createShowTraineesIntend,
} from '../intends/UserIntend'
import {createAddTraineeAction} from '../trainees'
import {
  createIngestTraineesAction,
  TraineeActions,
  SaveTraineeFSA,
} from '../trainees/traineeActions'

export function* traineeSagas() {
  yield takeEvery(TraineeActions.FETCH_TRAINEES, fetchTrainees)
  // yield takeEvery(TraineeActions.FETCH_TRAINEE, fetchTrainee)
  yield takeEvery(TraineeActions.SAVE_TRAINEE, saveTrainee)
}

function* saveTrainee(action: SaveTraineeFSA) {
  if (action.payload) {
    try {
      const {id} = yield call(() =>
        db.collection(DbCollection.Trainee).add(action.payload!)
      )

      const trainee: Trainee = {...action.payload!, id}
      yield put(createAddTraineeAction(trainee))
      yield put(createShowTraineesIntend())
    } catch (e) {
      console.error(e)
      // yield some error
    }
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
