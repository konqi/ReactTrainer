import {put, takeEvery} from '@redux-saga/core/effects'
import {
  UserIntend,
  AddTraineeIntendFSA,
  ShowTraineeDetailsIntendFSA,
} from '../intends/UserIntend'
import {
  createSaveTraineeAction,
  createFetchTraineesAction,
} from '../trainees/traineeActions'
import {createUiNavigateAction} from '../ui/uiActions'
import {Page} from '../../types/page'

export function* userIntendSagas() {
  yield takeEvery(UserIntend.ADD_TRAINEE, addTrainee)
  yield takeEvery(UserIntend.SHOW_TRAINEES, showTrainees)
  yield takeEvery(UserIntend.SHOW_TRAINEE_DETAILS, showTraineeDetails)
}

function* addTrainee({payload}: AddTraineeIntendFSA) {
  yield put(createSaveTraineeAction(payload!))
}

function* showTrainees() {
  yield put(createFetchTraineesAction())
  yield put(createUiNavigateAction(Page.Trainees))
}

function* showTraineeDetails(action: ShowTraineeDetailsIntendFSA) {
  if (action.payload) {
    yield put(
      createUiNavigateAction(Page.Trainee, {traineeId: action.payload!})
    )
  } else {
    // yield some error?
    console.error('cannot open trainee details for unknown trainee')
  }
}
