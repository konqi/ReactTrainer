import {Trainee} from '../../types/Trainee'
import {FSA} from '../../types/FSA'

export enum TraineeActions {
  ADD_TRAINEE = '[TRAINEE] add',
  REMOVE_TRAINEE = '[TRAINEE] remove',
  OPEN_TRAINEE = '[TRAINEE] open',
}

export type AddTraineeFSA = FSA<TraineeActions.ADD_TRAINEE, Trainee>
export const createAddTraineeAction = (payload: Trainee): AddTraineeFSA => ({
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

export type TraineeId = string
export type OpenTraineeFSA = FSA<TraineeActions.OPEN_TRAINEE, TraineeId>
export const createOpenTraineeAction = (traineeId: string): OpenTraineeFSA => ({
  type: TraineeActions.OPEN_TRAINEE,
  payload: traineeId,
})
