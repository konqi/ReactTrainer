import {TraineeState, reduceTrainees} from './traineeReducer'
import {createAddTraineeAction} from './traineeActions'

describe('traineeReducer', () => {
  it('should add trainee to state with ADD_TRAINEE action', () => {
    jest.mock('uuid')

    const newTrainee = {
      name: 'Tester',
      price: 1500,
    }

    const initialState: TraineeState = []
    const action = createAddTraineeAction(newTrainee)

    expect(initialState.length).toBe(0)
    const state = reduceTrainees(initialState, action)
    expect(state.length).toBeGreaterThan(0)
    expect(state).toEqual([{...newTrainee, id: '1'}])
  })
})
