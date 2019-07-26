import React from 'react'
import {render, cleanup} from '@testing-library/react'
import {TraineeHistory, TraineeHistoryConnected} from './TraineeHistory'
import {
  TraineeBuilder,
  SessionBuilder,
  createMockStore,
} from '../__mocks__/store'
import {initialApplicationState} from '../state'
import {Provider} from 'react-redux'
import {restoreCausality, freezeTime} from '../__mocks__/date'

describe('snapshot tests', () => {
  beforeAll(() => {
    // @ts-ignore
    global.Date = freezeTime(3141592653589)
  })

  afterAll(() => {
    global.Date = restoreCausality()
  })
  afterEach(cleanup)
  it('renders table with sessions', () => {
    const trainee = new TraineeBuilder().withPrice(10).build()
    const session1 = new SessionBuilder(trainee.id)
      .withId('Session1')
      .withPayedAmount(5)
      .build()
    const session2 = new SessionBuilder(trainee.id)
      .withId('Session2')
      .withPayedAmount(10)
      .build()
    const session3 = new SessionBuilder(trainee.id)
      .withId('Session3')
      .withPayedAmount(15)
      .build()

    const {baseElement} = render(
      <TraineeHistory
        trainee={trainee}
        sessions={[session1, session2, session3]}
      />
    )

    expect(baseElement).toMatchSnapshot()
  })
})

describe('integration tests', () => {
  beforeAll(() => {
    // @ts-ignore
    global.Date = freezeTime(3141592653589)
  })

  afterAll(() => {
    global.Date = restoreCausality()
  })
  afterEach(cleanup)
  it('renders table with session data from store', () => {
    const trainee = new TraineeBuilder().withPrice(10).build()
    const session1 = new SessionBuilder(trainee.id)
      .withId('Session1')
      .withPayedAmount(5)
      .build()
    const session2 = new SessionBuilder(trainee.id)
      .withId('Session2')
      .withPayedAmount(10)
      .build()
    const session3 = new SessionBuilder(trainee.id)
      .withId('Session3')
      .withPayedAmount(15)
      .build()
    trainee.sessionsRef = [session1.id, session2.id, session3.id]

    const store = createMockStore({
      ...initialApplicationState,
      trainees: {
        [trainee.id]: trainee,
      },
      sessions: {
        [session1.id]: session1,
        [session2.id]: session2,
        [session3.id]: session3,
      },
    })

    const {baseElement} = render(
      <Provider store={store}>
        <TraineeHistoryConnected traineeId={trainee.id} />
      </Provider>
    )

    expect(baseElement).toMatchSnapshot()
  })
})
