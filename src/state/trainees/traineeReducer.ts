import {TraineeActions} from './traineeActions'
import {TraineeFSAs, TraineeState} from './types'
import {Trainee} from '../../types/Trainee'
import {omit} from 'lodash'

export const initialTraineeState: TraineeState = {}

export const reduceTrainees = (
  state: TraineeState = initialTraineeState,
  action: TraineeFSAs
): TraineeState => {
  switch (action.type) {
    case TraineeActions.INGEST_TRAINEE:
      const trainee = action.payload as Trainee
      return {...state, [trainee.id]: trainee}
    case TraineeActions.INGEST_TRAINEES:
      const trainees = action.payload as {[key: string]: Trainee}
      return {...state, ...trainees}
    case TraineeActions.EXPEL_TRAINEES:
      return omit(state, action.payload as string[])
    default:
      return state
  }
}
