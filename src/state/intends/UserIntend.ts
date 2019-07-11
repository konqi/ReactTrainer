import {Trainee} from '../../types/Trainee'
import {FSA} from '../../types/FSA'
import {Session} from '../../types/Session'

export enum UserIntend {
  ADD_TRAINEE = '[INTEND] add trainee',
  DELETE_TRAINEE = '[INTEND] delete trainee',
  ADD_SESSION = '[INTEND] add session',
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

export const createShowTraineesIntend = () => ({
  type: UserIntend.SHOW_TRAINEES,
})

export type AddSessionIntendPayload = Omit<Session, 'id' | 'traineeRef'>
export interface AddSessionIntendMeta {
  traineeId: string
}
export type AddTrainingIntendFSA = FSA<
  UserIntend.ADD_SESSION,
  AddSessionIntendPayload,
  AddSessionIntendMeta
>
export const createAddTrainingIntend = (
  training: AddSessionIntendPayload,
  traineeId: string
): AddTrainingIntendFSA => ({
  type: UserIntend.ADD_SESSION,
  payload: training,
  meta: {traineeId},
})

export type ShowTraineeDetailsIntendFSA = FSA<
  UserIntend.SHOW_TRAINEE_DETAILS,
  string
>
export const createShowTraineeDetailsIntend = (
  traineeId: string
): ShowTraineeDetailsIntendFSA => ({
  type: UserIntend.SHOW_TRAINEE_DETAILS,
  payload: traineeId,
})
