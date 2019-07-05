import {ApplicationState} from '.'
import {FSA} from '../types/FSA'
import {reduceTrainees} from './trainees'

export const rootReducer = (
  state: ApplicationState,
  action: FSA<any, any>
): ApplicationState => ({
  trainees: reduceTrainees(state.trainees, action),
})
