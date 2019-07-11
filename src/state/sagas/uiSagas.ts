import {put, takeEvery} from '@redux-saga/core/effects'
import {Page} from '../../types/page'
import {UserIntend, ShowTraineeDetailsIntendFSA} from '../intends/UserIntend'
import {createUiNavigateAction} from '../ui/uiActions'
import {OpenTraineeFSA} from '../trainees/traineeActions'

export function* uiSagas() {
  yield takeEvery(UserIntend.SHOW_TRAINEES, openTraineesView)
  yield takeEvery(UserIntend.SHOW_TRAINEE_DETAILS, openTraineeDetailsView)
}

function* openTraineesView() {
  yield put(createUiNavigateAction(Page.Trainees))
}

function* openTraineeDetailsView(action: ShowTraineeDetailsIntendFSA) {
  if (action.payload) {
    yield put(
      createUiNavigateAction(Page.Trainee, {traineeId: action.payload!})
    )
  } else {
    // yield some error?
  }
}
