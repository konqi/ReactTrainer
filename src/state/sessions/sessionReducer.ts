import {SessionState, SessionFSAs} from './types'
import { SessionActions } from './sessionActions';
import { Session } from '../../types/Session';

export const initialSessionState: SessionState = {}

export const reduceSessions =  (
    state: SessionState = initialSessionState,
    action: SessionFSAs
  ): SessionState => {
    switch (action.type) {
      case SessionActions.ADD_SESSION:
        const session = action.payload as Session
        return {...state, [session.id]: session}
      case SessionActions.ADD_SESSIONS:
        const sessions = action.payload as {[key: string]: Session}
        return {...state, ...sessions}
      default:
        return state
    }
  }
  