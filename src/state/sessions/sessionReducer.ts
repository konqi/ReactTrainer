import {SessionState, SessionFSAs} from './types'
import {SessionActions} from './sessionActions'
import {Session} from '../../types/Session'
import {omit} from 'lodash'

export const initialSessionState: SessionState = {}

export const reduceSessions = (
  state: SessionState = initialSessionState,
  action: SessionFSAs
): SessionState => {
  switch (action.type) {
    case SessionActions.INGEST_SESSION:
      const session = action.payload as Session
      return {...state, [session.id]: session}
    case SessionActions.INGEST_SESSIONS:
      const sessions = action.payload as {[key: string]: Session}
      return {...state, ...sessions}
    case SessionActions.EXPEL_SESSION:
      return omit(state, action.payload as string[])
    default:
      return state
  }
}
