import {TraineeState, TraineeFSAs} from './trainees/types'
import {initialTraineeState} from './trainees'
import {UiState, UiFSAs} from './ui/types'
import {TrainingFSAs} from './trainings/types'
import {initialUiState} from './ui/uiReducer'
import {createStore, applyMiddleware} from 'redux'
import {rootReducer} from './rootReducer'
import createSagaMiddleware from 'redux-saga'
import {rootSaga} from './sagas/rootSaga'

export interface ApplicationState {
  trainees: TraineeState
  ui: UiState
}

export const initialApplicationState: ApplicationState = {
  trainees: initialTraineeState,
  ui: initialUiState,
}

export type Action = TraineeFSAs | TrainingFSAs | UiFSAs

const sagaMiddleware = createSagaMiddleware()

export const store = createStore(
  rootReducer,
  initialApplicationState,
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)
