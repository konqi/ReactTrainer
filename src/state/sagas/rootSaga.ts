import {takeEvery, select, call} from '@redux-saga/core/effects'
import {UiActions} from '../ui/uiActions'
import {ApplicationState} from '..'
import {UiState} from '../ui/types'
import {traineeSagas} from './traineeSags'

export function* rootSaga() {
  yield call(traineeSagas)
  yield takeEvery(UiActions.NAVIGATE, tester)
}

function* tester() {
  const ui: UiState = yield select(
    (state: ApplicationState): UiState => state.ui
  )
  console.log(ui)
  return
}
