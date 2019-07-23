import {FSA} from '../../types/FSA'
import {Session} from '../../types/Session'

export enum SessionActions {
  INGEST_SESSION = '[SESSION] add',
  INGEST_SESSIONS = '[SESSION] add multiple',
  EXPEL_SESSION = '[SESSION] expel from store',

  SAVE_SESSION_FOR_TRAINEE = '[SESSION] save session for trainee',
  DELETE_SESSIONS_FOR_TRAINEE = '[SESSION] delete sessions for trainee',
  FETCH_SESSIONS_FOR_TRAINEE = '[SESSION] fetch sessions for trainee',
}

export type IngestSessionPayload = Omit<Session, 'id' | 'traineeRef'>
export type IngestSessionFSA = FSA<
  SessionActions.INGEST_SESSION,
  IngestSessionPayload
>
export const createIngestSessionAction = (
  sessionToIngest: IngestSessionPayload
): IngestSessionFSA => ({
  type: SessionActions.INGEST_SESSION,
  payload: sessionToIngest,
})

export type IngestSessionsPayload = {[key: string]: Session}
export type IngestSessionsFSA = FSA<
  SessionActions.INGEST_SESSIONS,
  IngestSessionsPayload
>
export const createIngestSessionsAction = (
  sessionsToIngest: IngestSessionsPayload
): IngestSessionsFSA => ({
  type: SessionActions.INGEST_SESSIONS,
  payload: sessionsToIngest,
})

export type ExpelSessionActionFSA = FSA<SessionActions.EXPEL_SESSION, string[]>
export const createExpelSessionAction = (...sessionIds: string[]) => ({
  type: SessionActions.EXPEL_SESSION,
  payload: sessionIds,
})

export type FetchSessionsForTraineeFSA = FSA<
  SessionActions.FETCH_SESSIONS_FOR_TRAINEE,
  string
>
export const createFetchSessionsForTraineeAction = (
  traineeId: string
): FetchSessionsForTraineeFSA => ({
  type: SessionActions.FETCH_SESSIONS_FOR_TRAINEE,
  payload: traineeId,
})

export type DeleteSessionsForTraineeFSA = FSA<
  SessionActions.DELETE_SESSIONS_FOR_TRAINEE,
  string
>
export const createDeleteSessionsForTraineeAction = (
  traineeId: string
): DeleteSessionsForTraineeFSA => ({
  type: SessionActions.DELETE_SESSIONS_FOR_TRAINEE,
  payload: traineeId,
})

export type SaveSessionForTraineePayload = Omit<Session, 'id' | 'traineeRef'>
export type SaveSessionForTraineeFSA = FSA<
  SessionActions.SAVE_SESSION_FOR_TRAINEE,
  SaveSessionForTraineePayload,
  {traineeId: string}
>
export const createSaveSessionForTraineeAction = (
  traineeId: string,
  session: SaveSessionForTraineePayload
) => ({
  type: SessionActions.SAVE_SESSION_FOR_TRAINEE,
  payload: session,
  meta: {traineeId},
})
