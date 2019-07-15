import {Trainee} from '../../types/Trainee'
import {FSA} from '../../types/FSA'

export enum TraineeActions {
  INGEST_TRAINEE = '[TRAINEE] add',
  INGEST_TRAINEES = '[TRAINEE] add multiple',

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

// export type RemoveTraineePayload = string
// export type RemoveTraineeFSA = FSA<
//   TraineeActions.REMOVE_TRAINEE,
//   RemoveTraineePayload
// >
// export const createRemoveTraineeAction = (
//   traineeId: string
// ): RemoveTraineeFSA => ({
//   type: TraineeActions.REMOVE_TRAINEE,
//   payload: traineeId,
// })

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
