import {Trainee} from '../../types/Trainee'
import {FSA} from '../../types/FSA'

export enum TraineeActions {
  INGEST_TRAINEE = '[TRAINEE] add',
  INGEST_TRAINEES = '[TRAINEE] add multiple',
  EXPEL_TRAINEES = '[TRAINEE] expel from store',

  DELETE_TRAINEE = '[TRAINEE] delete',
  SAVE_TRAINEE = '[TRAINEE] save',
  UPDATE_TRAINEE = '[TRAINEE] update',
  FETCH_TRAINEE = '[TRAINEE] fetch',
  FETCH_TRAINEES = '[TRAINEE] fetch multiple',
}

export type IngestTraineeFSA = FSA<TraineeActions.INGEST_TRAINEE, Trainee>
export const createIngestTraineeAction = (
  payload: Trainee
): IngestTraineeFSA => ({
  type: TraineeActions.INGEST_TRAINEE,
  payload,
})

export type IngestTraineesFSA = FSA<
  TraineeActions.INGEST_TRAINEES,
  {[key: string]: Trainee}
>
export const createIngestTraineesAction = (payload: {
  [key: string]: Trainee
}): IngestTraineesFSA => ({
  type: TraineeActions.INGEST_TRAINEES,
  payload,
})

export type ExpelTraineeFSA = FSA<TraineeActions.EXPEL_TRAINEES, string[]>
export const createExpelTraineeAction = (
  ...traineeIds: string[]
): ExpelTraineeFSA => ({
  type: TraineeActions.EXPEL_TRAINEES,
  payload: traineeIds,
})

export type DeleteTraineePayload = string
export type DeleteTraineeFSA = FSA<
  TraineeActions.DELETE_TRAINEE,
  DeleteTraineePayload
>
export const createDeleteTraineeAction = (
  traineeId: string
): DeleteTraineeFSA => ({
  type: TraineeActions.DELETE_TRAINEE,
  payload: traineeId,
})

export type SaveTraineePayload = Omit<Trainee, 'id'>
export type SaveTraineeFSA = FSA<
  TraineeActions.SAVE_TRAINEE,
  SaveTraineePayload
>
export const createSaveTraineeAction = (
  payload: SaveTraineePayload
): SaveTraineeFSA => ({
  type: TraineeActions.SAVE_TRAINEE,
  payload,
})

export const createFetchTraineesAction = () => ({
  type: TraineeActions.FETCH_TRAINEES,
})
