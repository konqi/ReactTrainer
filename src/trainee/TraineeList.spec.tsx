import * as React from 'react'
import {TraineeListConnected} from './TraineeList'
import {render, cleanup, fireEvent} from '@testing-library/react'
import {ApplicationState} from '../state'
import {createStore} from 'redux'
import {rootReducer} from '../state/rootReducer'
import {Provider} from 'react-redux'
import {TraineeBuilder} from '../__mocks__/store'
import {
  createShowTraineeDetailsIntend,
  createDeleteTraineeIntend,
} from '../state/intends/UserIntend'
import {createUiNavigateAction} from '../state/ui/uiActions'
import {Page} from '../types/page'

describe('snapshot tests', () => {
  afterEach(cleanup)
  test.each`
    description      | trainees
    ${'no trainee'}  | ${[]}
    ${'one trainee'} | ${[{id: 0, name: 'Tester', price: 1500}]}
  `('should show TraineeList with $description', ({trainees}) => {
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

describe('integration tests', () => {
  afterEach(cleanup)
  it('fires intend to show trainee details, when trainee row is clicked', () => {
    const trainee1 = new TraineeBuilder()
      .withId('trainee1')
      .withName('Bob')
      .build()
    const trainee2 = new TraineeBuilder()
      .withId('trainee2')
      .withName('Alice')
      .build()
    const state: Pick<ApplicationState, 'trainees'> = {
      trainees: {[trainee1.id]: trainee1, [trainee2.id]: trainee2},
    }
    const store = createStore(rootReducer, state)
    const spy = jest.spyOn(store, 'dispatch')

    const {getByText, getByLabelText, unmount, getAllByTestId} = render(
      <Provider store={store}>
        <TraineeListConnected />
      </Provider>
    )

    fireEvent.click(getByText('Bob'))

    expect(spy).toHaveBeenCalledWith(
      createShowTraineeDetailsIntend(trainee1.id)
    )

    spy.mockClear()

    fireEvent.click(getByText('Alice'))

    expect(spy).toHaveBeenCalledWith(
      createShowTraineeDetailsIntend(trainee2.id)
    )

    spy.mockClear()

    fireEvent.click(getAllByTestId('deleteButton')[0])
    expect(spy).toHaveBeenCalledWith(createDeleteTraineeIntend(trainee1.id))

    spy.mockClear()

    fireEvent.click(getAllByTestId('deleteButton')[1])
    expect(spy).toHaveBeenCalledWith(createDeleteTraineeIntend(trainee2.id))

    spy.mockClear()

    fireEvent.click(getByLabelText('Add'))
    expect(spy).toHaveBeenCalledWith(createUiNavigateAction(Page.Create))

    unmount()
  })
})
