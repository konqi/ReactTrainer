import {fireEvent, render} from '@testing-library/react'
import * as React from 'react'
import {TraineeDetails} from './TraineeDetails'
import {Provider} from 'react-redux'
import {
  createMockStore,
  TraineeBuilder,
  SessionBuilder,
} from '../__mocks__/store'
import {initialApplicationState, ApplicationState} from '../state'
import {restoreCausality, freezeTime} from '../__mocks__/date'

describe('snapshot tests', () => {
  beforeAll(() => {
    // @ts-ignore
    global.Date = freezeTime()
  })

  afterAll(() => {
    global.Date = restoreCausality()
  })

  test('with no other session', () => {
    const trainee = new TraineeBuilder().build()
    const store = createMockStore({
      ...initialApplicationState,
      trainees: {
        [trainee.id]: trainee,
      },
    })

    const {unmount, baseElement} = render(
      <Provider store={store}>
        <TraineeDetails traineeId={'traineeId'} />
      </Provider>
    )

    expect(baseElement).toMatchSnapshot()

    unmount()
  })

  test('with session in past', () => {
    const trainee = new TraineeBuilder().build()
    const session = new SessionBuilder(trainee.id)
      .withDatetime(new Date(1))
      .build()
    trainee.sessionsRef = [session.id]
    const store = createMockStore({
      ...initialApplicationState,
      trainees: {
        [trainee.id]: trainee,
      },
      sessions: {[session.id]: session},
    })

    const {unmount, baseElement} = render(
      <Provider store={store}>
        <TraineeDetails traineeId={'traineeId'} />
      </Provider>
    )

    expect(baseElement).toMatchSnapshot()

    unmount()
  })

  test('with session in future', () => {
    const trainee = new TraineeBuilder().build()
    const session = new SessionBuilder(trainee.id)
      .withDatetime(new Date(Date.now() + 2 * 24 * 60 ** 2 * 1000))
      .build()
    trainee.sessionsRef = [session.id]
    const store = createMockStore({
      ...initialApplicationState,
      trainees: {
        [trainee.id]: trainee,
      },
      sessions: {[session.id]: session},
    })

    const {unmount, baseElement} = render(
      <Provider store={store}>
        <TraineeDetails traineeId={'traineeId'} />
      </Provider>
    )

    expect(baseElement).toMatchSnapshot()

    unmount()
  })

  test('with sessions in past and future', () => {
    const trainee = new TraineeBuilder().build()
    const pastSession = new SessionBuilder(trainee.id)
      .withId('pastSessionId')
      .withDatetime(new Date(Date.now() - 2 * 24 * 60 ** 2 * 1000))
      .build()
    const futureSession = new SessionBuilder(trainee.id)
      .withId('futureSessionId')
      .withDatetime(new Date(Date.now() + 2 * 24 * 60 ** 2 * 1000))
      .build()
    trainee.sessionsRef = [futureSession.id, pastSession.id]
    const store = createMockStore({
      ...initialApplicationState,
      trainees: {
        [trainee.id]: trainee,
      },
      sessions: {
        [futureSession.id]: futureSession,
        [pastSession.id]: pastSession,
      },
    })

    const {unmount, baseElement} = render(
      <Provider store={store}>
        <TraineeDetails traineeId={'traineeId'} />
      </Provider>
    )

    expect(baseElement).toMatchSnapshot()

    unmount()
  })

  test('with trainee missing in store', () => {
    const {unmount, baseElement} = render(
      <Provider store={createMockStore(initialApplicationState)}>
        <TraineeDetails traineeId={'traineeId'} />
      </Provider>
    )

    expect(baseElement).toMatchSnapshot()

    unmount()
  })
})
