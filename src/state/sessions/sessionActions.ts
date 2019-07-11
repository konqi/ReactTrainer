import {FSA} from '../../types/FSA'
import {Session} from '../../types/Session'

export enum SessionActions {
  ADD_SESSION = '[SESSION] add',
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
