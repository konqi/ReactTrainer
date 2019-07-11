import {TraineeActions} from './traineeActions'
import {TraineeFSAs, TraineeState} from './types'
import {Trainee} from '../../types/Trainee'

export const initialTraineeState: TraineeState = {}

export const reduceTrainees = (
  state: TraineeState = initialTraineeState,
  action: TraineeFSAs
): TraineeState => {
  switch (action.type) {
    case TraineeActions.ADD_TRAINEE:
      const trainee = action.payload as Trainee
      return {...state, [trainee.id]: trainee}
    case TraineeActions.ADD_TRAINEES:
      const trainees = action.payload as {[key: string]: Trainee}
      return {...state, ...trainees}
    default:
      return state
  }
}
