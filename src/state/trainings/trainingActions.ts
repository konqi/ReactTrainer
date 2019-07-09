import {FSA} from '../../types/FSA'
import {Training} from '../../types/Training'

export enum TrainingActions {
  ADD_TRAINING = '[TRAINING] add',
}

export type AddTrainingPayload = Omit<Training, 'id'>
export type AddTrainingFSA = FSA<
  TrainingActions.ADD_TRAINING,
  AddTrainingPayload
>
export const createAddTrainingAction = (
  payload: AddTrainingPayload
): AddTrainingFSA => ({
  type: TrainingActions.ADD_TRAINING,
  payload,
})
