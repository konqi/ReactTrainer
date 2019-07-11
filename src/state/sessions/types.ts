import {AddSessionFSA, AddSessionsFSA} from './sessionActions'
import {Session} from '../../types/Session'

export type SessionState = {[key: string]: Session}
export type SessionFSAs = AddSessionFSA | AddSessionsFSA
