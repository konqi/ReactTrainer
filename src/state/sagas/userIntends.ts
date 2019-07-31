import {put, takeEvery, all} from '@redux-saga/core/effects'
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
  createFetchTraineeAction,
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
  yield all([
    takeEvery(UserIntend.ADD_TRAINEE, addTrainee),
    takeEvery(UserIntend.DELETE_TRAINEE, deleteTrainee),
    takeEvery(UserIntend.SHOW_TRAINEES, showTrainees),
    takeEvery(UserIntend.ADD_SESSION, addSession),
    takeEvery(UserIntend.SHOW_TRAINEE_DETAILS, showTraineeDetails),
  ])
}

export function* addTrainee({payload}: AddTraineeIntendFSA) {
  yield put(createSaveTraineeAction(payload!))
  // return to trainee list
  yield put(createShowTraineesIntend())
}

export function* showTrainees() {
  yield put(createFetchTraineesAction())
  yield put(createUiNavigateAction(Page.Trainees))
}

export function* showTraineeDetails(action: ShowTraineeDetailsIntendFSA) {
  if (action.payload) {
    yield put(createFetchTraineeAction(action.payload!))
    yield put(createFetchSessionsForTraineeAction(action.payload!))
    yield put(
      createUiNavigateAction(Page.Trainee, {traineeId: action.payload!})
    )
  } else {
    // yield some error?
    console.error('cannot open trainee details for unknown trainee')
  }
}

export function* addSession(action: IngestSessionFSA) {
  yield put(
    createSaveSessionForTraineeAction(action.meta.traineeId, action.payload!)
  )
}

export function* deleteTrainee(action: DeleteTraineeIntendFSA) {
  yield put(createDeleteSessionsForTraineeAction(action.payload!))
  yield put(createDeleteTraineeAction(action.payload!))
}
