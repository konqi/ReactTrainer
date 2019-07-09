import React from 'react'
import {render} from '@testing-library/react'
import {TrainingEntry} from './TrainingEntry'

const OriginalDate = Date
describe('snapshot tests', () => {
  beforeAll(() => {
    jest.mock('MockDate')
    const {MockDate} = require('MockDate')
    global.Date = MockDate
  })

  afterAll(() => {
    global.Date = OriginalDate
  })

  it('should show a valid entry', () => {
    const {baseElement, unmount} = render(<TrainingEntry date={new Date()} />)
    expect(baseElement).toMatchSnapshot()
    unmount()
  })
})
