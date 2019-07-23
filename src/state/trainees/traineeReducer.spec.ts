import {reduceTrainees} from './traineeReducer'
import {createIngestTraineeAction} from './traineeActions'
import {TraineeState} from './types'
import {TraineeBuilder} from '../../__mocks__/store'

describe('traineeReducer', () => {
  it('should add trainee to state with ADD_TRAINEE action', () => {
    jest.mock('uuid')

    const newTrainee = new TraineeBuilder()
      .withName('Tester')
      .withPrice(1500)
      .build()

    const initialState: TraineeState = {}
    const action = createIngestTraineeAction(newTrainee)

    expect(Object.keys(initialState).length).toBe(0)
    const state = reduceTrainees(initialState, action)
    expect(Object.keys(state).length).toBeGreaterThan(0)
    expect(state).toEqual({[newTrainee.id]: newTrainee})
  })
})
