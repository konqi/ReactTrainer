import {Trainee} from '../../types/trainee'
import {FSA} from '../../types/FSA'

export enum TraineeActions {
  ADD_TRAINEE,
  REMOVE_TRAINEE,
}

export type AddTraineePayload = Omit<Trainee, 'id'>
export type AddTraineeFSA = FSA<TraineeActions.ADD_TRAINEE, AddTraineePayload>
export const createAddTraineeAction = (
  payload: AddTraineePayload
): AddTraineeFSA => ({
  type: TraineeActions.ADD_TRAINEE,
  payload,
})

export type RemoveTraineePayload = string
export type RemoveTraineeFSA = FSA<
  TraineeActions.REMOVE_TRAINEE,
  RemoveTraineePayload
>
export const createRemoveTraineeAction = (
  traineeId: string
): RemoveTraineeFSA => ({
  type: TraineeActions.REMOVE_TRAINEE,
  payload: traineeId,
})
