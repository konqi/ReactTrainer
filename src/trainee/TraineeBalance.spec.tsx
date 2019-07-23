import React from 'react'
import {render, cleanup} from '@testing-library/react'
import {TraineeBalance, TraineeBalanceConnected} from './TraineeBalance'
import {Provider} from 'react-redux'
import {
  TraineeBuilder,
  SessionBuilder,
  createMockStore,
} from '../__mocks__/store'
import {initialApplicationState} from '../state'

describe('snapshot tests', () => {
  afterEach(cleanup)

  test.each`
    description   | balance
    ${'positive'} | ${1}
    ${'negative'} | ${-1}
    ${'zero'}     | ${0}
  `('renders properly with $description balance', ({balance}) => {
    const {baseElement} = render(<TraineeBalance totalBalance={balance} />)
    expect(baseElement).toMatchSnapshot()
  })
})

describe('integration tests', () => {
  afterEach(cleanup)

  test.each`
    description                     | traineePrice | sessionPrice | payedAmount | expectedBalance
    ${'zero balance'}               | ${10}        | ${undefined} | ${10}       | ${0}
    ${'underpayed'}                 | ${10}        | ${undefined} | ${5}        | ${-5}
    ${'overpayed'}                  | ${10}        | ${undefined} | ${15}       | ${5}
    ${'custom price: zero balance'} | ${10}        | ${15}        | ${15}       | ${0}
    ${'custom price: underpayed'}   | ${10}        | ${15}        | ${10}       | ${-5}
    ${'custom price: overpayed'}    | ${10}        | ${5}         | ${10}       | ${5}
  `(
    'single session tests with $description',
    ({traineePrice, sessionPrice, payedAmount, expectedBalance}) => {
      const trainee = new TraineeBuilder().withPrice(traineePrice).build()
      const session = new SessionBuilder(trainee.id)
        .withPrice(sessionPrice)
        .withPayedAmount(payedAmount)
        .build()
      trainee.sessionsRef = [session.id]
      const store = createMockStore({
        ...initialApplicationState,
        trainees: {
          [trainee.id]: trainee,
        },
        sessions: {[session.id]: session},
      })

      const {queryByText} = render(
        <Provider store={store}>
          <TraineeBalanceConnected traineeId={trainee.id} />
        </Provider>
      )

      expect(queryByText(/Kontostand/)!.firstElementChild!.textContent).toEqual(
        `${expectedBalance} €`
      )
    }
  )

  describe.each`
    description        | traineePrice | session1Price | session2Price
    ${'default price'} | ${10}        | ${undefined}  | ${undefined}
    ${'custom price'}  | ${5}         | ${5}          | ${15}
    ${'mixed price'}   | ${10}        | ${undefined}  | ${20}
  `('with $description', ({traineePrice, session1Price, session2Price}) => {
    test.each`
      description     | session1PayedAmount | session2PayedAmount
      ${'balanced'}   | ${10}               | ${10}
      ${'underpayed'} | ${10}               | ${5}
      ${'overpayed'}  | ${15}               | ${15}
    `('$description', ({session1PayedAmount, session2PayedAmount}) => {
      const price1 = session1Price !== undefined ? session1Price : traineePrice
      const price2 = session2Price !== undefined ? session2Price : traineePrice
      const price = price1 + price2
      const payed = session1PayedAmount + session2PayedAmount
      const expectedBalance = payed - price

      const trainee = new TraineeBuilder().withPrice(traineePrice).build()
      const session1 = new SessionBuilder(trainee.id)
        .withId('Session1')
        .withPrice(session1Price)
        .withPayedAmount(session1PayedAmount)
        .build()
      const session2 = new SessionBuilder(trainee.id)
        .withId('Session2')
        .withPrice(session2Price)
        .withPayedAmount(session2PayedAmount)
        .build()
      trainee.sessionsRef = [session1.id, session2.id]
      // make sure the sessions have different ids
      expect(session1.id).not.toEqual(session2.id)

      const store = createMockStore({
        ...initialApplicationState,
        trainees: {
          [trainee.id]: trainee,
        },
        sessions: {[session1.id]: session1, [session2.id]: session2},
      })

      const {queryByText} = render(
        <Provider store={store}>
          <TraineeBalanceConnected traineeId={trainee.id} />
        </Provider>
      )

      expect(queryByText(/Kontostand/)!.firstElementChild!.textContent).toEqual(
        `${expectedBalance} €`
      )
    })
  })
})
