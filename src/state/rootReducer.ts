import {combineReducers} from 'redux'
import {reduceTrainees} from './trainees'
import {reduceUi} from './ui'
import { reduceSessions } from './sessions';

export const rootReducer = combineReducers({
  trainees: reduceTrainees,
  ui: reduceUi,
  sessions: reduceSessions
})
