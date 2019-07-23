import {takeEvery} from '@redux-saga/core/effects'
import {createBrowserHistory} from 'history'
import {UiActions, UiNavigationFSA} from '../ui/uiActions'

const history = createBrowserHistory()

export function* uiSagas() {
  yield takeEvery(UiActions.NAVIGATE, updateBrowserHistory)
}

function* updateBrowserHistory(action: UiNavigationFSA) {
  const {page, params} = action.payload!
  // yield console.log(page, params)
  if (params) {
    yield history.push(
      `${page}?${Object.keys(params!)
        .map(key => `${key}=${params[key]}`)
        .join()}`
    )
  } else {
    yield history.push(page)
  }
}
