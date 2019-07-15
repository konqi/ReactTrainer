import {
  IngestSessionFSA,
  IngestSessionsFSA,
  ExpelSessionActionFSA,
} from './sessionActions'
import {Session} from '../../types/Session'

export type SessionState = {[key: string]: Session}
export type SessionFSAs =
  | IngestSessionFSA
  | IngestSessionsFSA
  | ExpelSessionActionFSA
