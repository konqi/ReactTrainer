import {applyMiddleware, compose, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {rootReducer} from './rootReducer'
import {rootSaga} from './sagas/rootSaga'
import {SessionFSAs, SessionState} from './sessions/types'
import {initialTraineeState} from './trainees'
import {TraineeFSAs, TraineeState} from './trainees/types'
import {UiFSAs, UiState} from './ui/types'
import {initialUiState} from './ui/uiReducer'
import {initialSessionState} from './sessions'

export interface ApplicationState {
  trainees: TraineeState
  sessions: SessionState
  ui: UiState
}

export const initialApplicationState: ApplicationState = {
  trainees: initialTraineeState,
  ui: initialUiState,
  sessions: initialSessionState,
}

export type Action = TraineeFSAs | SessionFSAs | UiFSAs

const sagaMiddleware = createSagaMiddleware()

const middleware = [sagaMiddleware]

//@ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
  rootReducer,
  initialApplicationState,
  composeEnhancers(applyMiddleware(...middleware))
)

sagaMiddleware.run(rootSaga)
