import {call, put, takeEvery} from '@redux-saga/core/effects'
import {normalize, schema} from 'normalizr'
import {db, DbCollection} from '../../db'
import {Trainee, traineeSchema} from '../../types/Trainee'
import {
  AddTraineeIntendFSA,
  createShowTraineesIntend,
  UserIntend,
} from '../intends/UserIntend'
import {createAddTraineeAction} from '../trainees'
import {createAddTraineesAction} from '../trainees/traineeActions'

export function* traineeSagas() {
  yield takeEvery(UserIntend.ADD_TRAINEE, addTraineeIntend)
  yield takeEvery(UserIntend.SHOW_TRAINEES, fetchTrainees)
}

function* addTraineeIntend(action: AddTraineeIntendFSA) {
  if (action.payload) {
    try {
      const {id} = yield call(() =>
        db.collection(DbCollection.Trainee).add(action.payload!)
      )

      const trainee: Trainee = {...action.payload!, id}
      yield put(createAddTraineeAction(trainee))
      yield put(createShowTraineesIntend())
    } catch (e) {
      // yield some error
    }
  }
}

function* fetchTrainees() {
  try {
    const trainees: firebase.firestore.QuerySnapshot = yield db
      .collection(DbCollection.Trainee)
      .get()

    const normalizedTrainees = normalize(
      trainees.docs.map(doc => ({...doc.data(), id: doc.id})),
      [traineeSchema]
    )

    yield put(createAddTraineesAction(normalizedTrainees.entities.trainee))
  } catch (e) {
    // yield some error
  }
}
