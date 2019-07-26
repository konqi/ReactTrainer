import * as React from 'react'
import {TraineeListConnected} from './TraineeList'
import {render} from '@testing-library/react'
import {ApplicationState} from '../state'
import {createStore} from 'redux'
import {rootReducer} from '../state/rootReducer'
import {Provider} from 'react-redux'

describe('snapshot tests', () => {
  test.each`
    description      | trainees
    ${'no trainee'}  | ${[]}
    ${'one trainee'} | ${[{id: 0, name: 'Tester', price: 1500}]}
  `('should show TraineeList with $description', ({description, trainees}) => {
    const state: Pick<ApplicationState, 'trainees'> = {
      trainees,
    }
    const store = createStore(rootReducer, state)

    const {baseElement, unmount} = render(
      <Provider store={store}>
        <TraineeListConnected />
      </Provider>
    )

    expect(baseElement).toMatchSnapshot()

    unmount()
  })
})
