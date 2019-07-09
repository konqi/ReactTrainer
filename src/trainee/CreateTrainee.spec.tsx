import {fireEvent, render} from '@testing-library/react'
import * as React from 'react'
import * as ReactRedux from 'react-redux'
import {Provider} from 'react-redux'
import {store} from '../state'
import {createAddTraineeAction} from '../state/trainees'
import {CreateTrainee} from './CreateTrainee'

describe('snapshot tests', () => {
  let dispatch = jest.fn()
  let useDispatch: any
  beforeEach(() => {
    dispatch.mockReset()
    useDispatch = jest
      .spyOn(ReactRedux, 'useDispatch')
      .mockImplementation(() => dispatch)
  })
  afterEach(() => {
    useDispatch.mockRestore()
  })

  test('loads items eventually', async () => {
    const {getByText, getByLabelText, unmount} = render(
      <Provider store={store}>
        <CreateTrainee />
      </Provider>
    )
    const expectedName = 'Dr. Testilon'
    fireEvent.change(getByLabelText('Name'), {
      target: {value: expectedName},
    })

    const expectedPrice = 2000
    fireEvent.change(getByLabelText('Preis'), {
      target: {value: expectedPrice},
    })

    // Click button
    fireEvent.click(getByText('Anlegen'))

    expect(dispatch).toHaveBeenCalledWith(
      createAddTraineeAction({name: expectedName, price: expectedPrice})
    )

    unmount()
  })
})

describe('unit tests', () => {
  it('should handle bad inputs nicely', () => {
    const {getByLabelText, unmount} = render(
      <Provider store={store}>
        <CreateTrainee />
      </Provider>
    )
    const priceInput = getByLabelText('Preis') as HTMLInputElement

    const validValue = '4711'
    fireEvent.change(priceInput, {
      target: {value: validValue},
    })
    expect(priceInput.value).toBe(validValue)

    const invalidValue = 'ABC'
    fireEvent.change(priceInput, {
      target: {value: invalidValue},
    })

    expect(priceInput.value).toBe(validValue)

    unmount()
  })
})
