import {TraineeActions} from './traineeActions'
import {TraineeFSAs, TraineeState} from './types'
import {Trainee} from '../../types/Trainee'

export const initialTraineeState = []

export const reduceTrainees = (
  state: TraineeState = initialTraineeState,
  action: TraineeFSAs
): TraineeState => {
  switch (action.type) {
    case TraineeActions.ADD_TRAINEE:
      return [...state, action.payload as Trainee]
    default:
      return state
  }
}
