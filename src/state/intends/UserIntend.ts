import {Trainee} from '../../types/Trainee'
import {FSA} from '../../types/FSA'

export enum UserIntend {
  ADD_TRAINEE = '[INTEND] add trainee',
  DELETE_TRAINEE = '[INTEND] delete trainee',
  ADD_TRAINING = '[INTEND] add training',
  SHOW_TRAINEES = '[INTEND] show trainees',
  SHOW_TRAINEE_DETAILS = '[INTEND] show trainee details',
}

export type AddTraineeIntendPayload = Omit<Trainee, 'id'>
export type AddTraineeIntendFSA = FSA<
  UserIntend.ADD_TRAINEE,
  AddTraineeIntendPayload
>
export const createAddTraineeIntend = (
  payload: AddTraineeIntendPayload
): AddTraineeIntendFSA => ({
  type: UserIntend.ADD_TRAINEE,
  payload,
})
