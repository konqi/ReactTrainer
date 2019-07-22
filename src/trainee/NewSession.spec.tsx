import {fireEvent, render, cleanup} from '@testing-library/react'
import * as React from 'react'
import {NewSession} from './NewSession'
import {freezeTime, restoreCausality} from '../__mocks__/date'

describe('snapshot tests', () => {
  beforeAll(() => {
    // @ts-ignore
    global.Date = freezeTime(3141592653589)
  })

  afterAll(() => {
    global.Date = restoreCausality()
  })

  afterEach(cleanup)

  it('should render without parameters', () => {
    const {baseElement, unmount} = render(<NewSession />)
    expect(baseElement).toMatchSnapshot()
    unmount()
  })

  it('should render with parameters', () => {
    const datetime = new Date()
    const description = ''
    const payedAmount = 10
    const {baseElement, unmount} = render(
      <NewSession {...{datetime, description, payedAmount}} />
    )
    expect(baseElement).toMatchSnapshot()
    unmount()
  })

  it('should render time select for future dates', () => {
    const datetime = new Date(Date.now() + 24 * 60 ** 2 * 1000) // tomorrow
    const description = ''
    const payedAmount = 10
    const {baseElement, unmount} = render(
      <NewSession {...{datetime, description, payedAmount}} />
    )
    expect(baseElement).toMatchSnapshot()
    unmount()
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

  it('should update datetime according to date input change', () => {
    const mockFn = jest.fn()
    const {getByLabelText, unmount} = render(
      <NewSession onChange={mockFn} datetime={new Date(0)} />
    )

    expect(mockFn).not.toHaveBeenCalled()
    fireEvent.change(getByLabelText('Datum'), {target: {value: '3333-11-22'}})
    const expectedDateTime = new Date(0)
    expectedDateTime.setFullYear(3333)
    expectedDateTime.setMonth(10)
    expectedDateTime.setDate(22)
    expect(mockFn).toHaveBeenCalledWith('date', expectedDateTime)

    unmount()
  })

  it('should update datetime according to time input change', () => {
    const mockFn = jest.fn()

    const future = new Date(Date.now() + 24 * 60 ** 2 * 1000) // tomorrow
    const {getByLabelText, unmount} = render(
      <NewSession datetime={future} onChange={mockFn} />
    )

    expect(mockFn).not.toHaveBeenCalled()
    fireEvent.change(getByLabelText('Uhrzeit'), {target: {value: '12:21'}})
    const expectedDateTime = future
    expectedDateTime.setHours(12)
    expectedDateTime.setMinutes(21)
    expectedDateTime.setSeconds(0)
    expectedDateTime.setMilliseconds(0)
    expect(mockFn).toHaveBeenCalledWith('time', expectedDateTime)

    unmount()
  })

  it('should update description', () => {
    const mockFn = jest.fn()
    const {getByLabelText, getByText, unmount} = render(
      <NewSession onChange={mockFn} />
    )

    expect(mockFn).not.toHaveBeenCalled()
    fireEvent.change(getByLabelText('Beschreibung'), {
      target: {value: 'Hello World!'},
    })
    expect(mockFn).toHaveBeenCalledWith('description', 'Hello World!')

    unmount()
  })

  it('should update payed amount', () => {
    const mockFn = jest.fn()
    const {getByLabelText, getByText, unmount} = render(
      <NewSession onChange={mockFn} />
    )

    expect(mockFn).not.toHaveBeenCalled()
    fireEvent.change(getByLabelText('Bezahlt'), {target: {value: '10'}})
    expect(mockFn).toHaveBeenCalledWith('payedAmount', 10)

    unmount()
  })

  it('should fire submit callback', () => {
    const mockFn = jest.fn()
    const {getByLabelText, getByText, getByRole, unmount} = render(
      <NewSession onSubmit={mockFn} />
    )

    expect(mockFn).not.toHaveBeenCalled()
    fireEvent.submit(getByRole('form'))
    expect(mockFn).toHaveBeenCalled()

    unmount()
  })
})
