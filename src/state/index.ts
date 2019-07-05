import {TraineeState, TraineeFSAs} from './trainees/types'
import {initialTraineeState} from './trainees'

export {rootReducer} from './rootReducer'

export interface ApplicationState {
  trainees: TraineeState
}

export const initialApplicationState: ApplicationState = {
  trainees: initialTraineeState,
}

export type Action = TraineeFSAs
