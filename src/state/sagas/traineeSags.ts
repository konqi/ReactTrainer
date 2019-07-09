import {takeEvery, call, put} from '@redux-saga/core/effects'
import {UserIntend, AddTraineeIntendFSA} from '../intends/UserIntend'
import {db, DbCollection} from '../../db'
import {Trainee} from '../../types/Trainee'
import {createAddTraineeAction} from '../trainees'

export function* traineeSagas() {
  yield takeEvery(UserIntend.ADD_TRAINEE, addTraineeIntend)
  yield takeEvery(UserIntend.SHOW_TRAINEES, fetchTrainees)
}

function* addTraineeIntend(action: AddTraineeIntendFSA) {
  console.log(action)
  if (action.payload) {
    try {
      const {id} = yield call(() =>
        db.collection(DbCollection.Trainee).add(action.payload!)
      )

      const trainee: Trainee = {...action.payload!, id}
      yield put(createAddTraineeAction(trainee))
    } catch (e) {
      // yield some error
    }
  }
}

function* fetchTrainees() {
  try {
    const trainees: Trainee[] = yield db.collection(DbCollection.Trainee).get()
    console.log(trainees)
  } catch (e) {
    // yield some error
  }
}
