import {reduceTrainees} from './traineeReducer'
import {createIngestTraineeAction} from './traineeActions'
import {TraineeState} from './types'

describe('traineeReducer', () => {
  it('should add trainee to state with ADD_TRAINEE action', () => {
    jest.mock('uuid')

    const newTrainee = {
      name: 'Tester',
      price: 1500,
    }

    const initialState: TraineeState = []
    const action = createIngestTraineeAction(newTrainee)

    expect(initialState.length).toBe(0)
    const state = reduceTrainees(initialState, action)
    expect(state.length).toBeGreaterThan(0)
    expect(state).toEqual([{...newTrainee, id: '1'}])
  })
})
