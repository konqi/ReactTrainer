import {put, takeEvery} from '@redux-saga/core/effects'
import {
  UserIntend,
  AddTraineeIntendFSA,
  ShowTraineeDetailsIntendFSA,
  DeleteTraineeIntendFSA,
  createShowTraineesIntend,
} from '../intends/UserIntend'
import {
  createSaveTraineeAction,
  createFetchTraineesAction,
  createDeleteTraineeAction,
} from '../trainees/traineeActions'
import {createUiNavigateAction} from '../ui/uiActions'
import {Page} from '../../types/page'
import {
  createDeleteSessionsForTraineeAction,
  createFetchSessionsForTraineeAction,
  IngestSessionFSA,
  createSaveSessionForTraineeAction,
} from '../sessions/sessionActions'

export function* userIntendSagas() {
  yield takeEvery(UserIntend.ADD_TRAINEE, addTrainee)
  yield takeEvery(UserIntend.DELETE_TRAINEE, deleteTrainee)
  yield takeEvery(UserIntend.SHOW_TRAINEES, showTrainees)
  yield takeEvery(UserIntend.SHOW_TRAINEE_DETAILS, showTraineeDetails)
  yield takeEvery(UserIntend.ADD_SESSION, addSession)
  yield takeEvery(UserIntend.SHOW_TRAINEE_DETAILS, showTraineeDetails)
}

function* addTrainee({payload}: AddTraineeIntendFSA) {
  yield put(createSaveTraineeAction(payload!))
  // return to trainee list
  yield put(createShowTraineesIntend())
}

function* showTrainees() {
  yield put(createFetchTraineesAction())
  yield put(createUiNavigateAction(Page.Trainees))
}

function* showTraineeDetails(action: ShowTraineeDetailsIntendFSA) {
  if (action.payload) {
    yield put(createFetchSessionsForTraineeAction(action.payload!))
    yield put(
      createUiNavigateAction(Page.Trainee, {traineeId: action.payload!})
    )
  } else {
    // yield some error?
    console.error('cannot open trainee details for unknown trainee')
  }
}

function* addSession(action: IngestSessionFSA) {
  yield put(
    createSaveSessionForTraineeAction(action.meta.traineeId, action.payload!)
  )
}

function* deleteTrainee(action: DeleteTraineeIntendFSA) {
  yield put(createDeleteSessionsForTraineeAction(action.payload!))
  yield put(createDeleteTraineeAction(action.payload!))
}
