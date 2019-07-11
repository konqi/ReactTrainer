import {FSA} from '../../types/FSA'
import {Session} from '../../types/Session'

export enum SessionActions {
  ADD_SESSION = '[SESSION] add',
  ADD_SESSIONS = '[SESSION] add multiple',
  FETCH_SESSIONS_FOR_TRAINEE = '[SESSION] fetch sessions for trainee',
}

export type AddSessionPayload = Omit<Session, 'id'>
export type AddSessionFSA = FSA<SessionActions.ADD_SESSION, AddSessionPayload>
export const createAddSessionAction = (
  payload: AddSessionPayload
): AddSessionFSA => ({
  type: SessionActions.ADD_SESSION,
  payload,
})

export type AddSessionsPayload = {[key:string]: Session}
export type AddSessionsFSA = FSA<SessionActions.ADD_SESSIONS, AddSessionsPayload>
export const createAddSessionsAction = (payload: AddSessionsPayload): AddSessionsFSA => ({
  type: SessionActions.ADD_SESSIONS,
  payload
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
