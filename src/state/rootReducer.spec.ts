import {rootReducer} from './rootReducer'
import {initialApplicationState} from '.'

describe('rootReducer', () => {
  it('should', () => {
    const result = rootReducer(initialApplicationState, {type: undefined})
    // nothing should happen without an action
    expect(result).toEqual(initialApplicationState)
  })
})
