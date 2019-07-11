import {all, spawn, call} from '@redux-saga/core/effects'
import {traineeSagas} from './traineeSagas'
import {uiSagas} from './uiSagas'
import {sessionSagas} from './sessionSagas'

export function* rootSaga() {
  const sagas = [traineeSagas, uiSagas, sessionSagas]
  yield all(
    sagas.map(saga =>
      spawn(function*() {
        while (true) {
          try {
            yield call(saga)
            break
          } catch (e) {
            console.log(e)
          }
        }
      })
    )
  )
}
