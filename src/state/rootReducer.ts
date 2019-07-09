import {combineReducers} from 'redux'
import {reduceTrainees} from './trainees'
import {reduceUi} from './ui'

export const rootReducer = combineReducers({
  trainees: reduceTrainees,
  ui: reduceUi,
})
