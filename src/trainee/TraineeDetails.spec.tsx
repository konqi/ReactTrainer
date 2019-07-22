import {fireEvent, render, cleanup} from '@testing-library/react'
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
import {UserIntend} from '../state/intends/UserIntend'
import {format} from 'date-fns'

describe('snapshot tests', () => {
  beforeAll(() => {
    // @ts-ignore
    global.Date = freezeTime()
  })

  afterAll(() => {
    global.Date = restoreCausality()
  })

  afterEach(() => {
    cleanup()
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

describe('integration tests', () => {
  afterEach(cleanup)

  it('should generate user intend with data from current state', async () => {
    const trainee = new TraineeBuilder().build()
    const store = createMockStore({
      ...initialApplicationState,
      trainees: {
        [trainee.id]: trainee,
      },
    })
    const spy = jest.spyOn(store, 'dispatch')

    const {unmount, getByLabelText, getByRole} = await render(
      <Provider store={store}>
        <TraineeDetails traineeId={'traineeId'} />
      </Provider>
    )

    const date = Date.now() + 24 * 60 ** 2 * 1000
    const session = new SessionBuilder('traineeId')
      .withDescription('your name here')
      .withPayedAmount(15)
      .withDatetime(new Date(date - (date % 60000))) // strip seconds and millis
      .build()

    fireEvent.change(getByLabelText('Datum'), {
      target: {value: format(session.datetime, 'YYYY-MM-DD')},
    })
    fireEvent.change(getByLabelText('Uhrzeit'), {
      target: {value: format(session.datetime, 'HH:mm')},
    })
    fireEvent.change(getByLabelText('Bezahlt'), {
      target: {value: `${session.payedAmount}`},
    })
    fireEvent.change(getByLabelText('Beschreibung'), {
      target: {value: session.description},
    })
    fireEvent.submit(getByRole('form'))

    expect(spy).toHaveBeenCalledWith({
      type: UserIntend.ADD_SESSION,
      payload: {
        datetime: session.datetime,
        description: session.description,
        payedAmount: session.payedAmount,
      },
      meta: {traineeId: 'traineeId'},
    })

    unmount()
  })
})
