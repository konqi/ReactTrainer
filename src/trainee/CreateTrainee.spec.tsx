import {fireEvent, render} from '@testing-library/react'
import * as React from 'react'
import * as ReactRedux from 'react-redux'
import {Provider} from 'react-redux'
import {store} from '../state'
import {createAddTraineeIntend} from '../state/intends/UserIntend'
import {CreateTrainee} from './CreateTrainee'

it('snapshot test', () => {
  const {baseElement, unmount} = render(
    <Provider store={store}>
      <CreateTrainee />
    </Provider>
  )

  expect(baseElement).toMatchSnapshot()

  unmount()
})

describe('integration tests', () => {
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
      createAddTraineeIntend({name: expectedName, price: expectedPrice})
    )

    unmount()
  })
})

describe('unit tests', () => {
  test.each`
    input     | expected
    ${'4711'} | ${'4711'}
    ${'ABC'}  | ${''}
    ${'!'}    | ${''}
    ${'0'}    | ${''}
    ${'0815'} | ${'815'}
  `(
    'when input is "$input" output should be "$expected"',
    ({input, expected}) => {
      const {getByLabelText, unmount} = render(
        <Provider store={store}>
          <CreateTrainee />
        </Provider>
      )
      const priceInput = getByLabelText('Preis') as HTMLInputElement

      fireEvent.change(priceInput, {
        target: {value: input},
      })
      expect(priceInput.value).toBe(expected)

      unmount()
    }
  )
})
