import {rootReducer} from './rootReducer'
import {initialApplicationState} from '.'

describe('rootReducer', () => {
  it('should', () => {
    // @ts-ignore
    const result = rootReducer(initialApplicationState, {type: undefined})
    console.log(result)
  })
})
