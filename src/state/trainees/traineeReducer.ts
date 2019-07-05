import {v1 as uuid} from 'uuid'
import {AddTraineePayload, TraineeActions} from './traineeActions'
import {TraineeFSAs, TraineeState} from './types'

export const initialTraineeState = []

export const reduceTrainees = (
  state: TraineeState = initialTraineeState,
  action: TraineeFSAs
): TraineeState => {
  switch (action.type) {
    case TraineeActions.ADD_TRAINEE:
      return [...state, {...(action.payload as AddTraineePayload), id: uuid()}]
    default:
      return state
  }
}

// const reducer = {
//   [TraineeActions.ADD_TRAINEE]: (
//     state: TraineeState = initialTraineeState,
//     action: FSA<TraineeActions, Omit<Trainee, 'id'>>
//   ) => [...state, {...action.payload, id: uuid()}],
// }
