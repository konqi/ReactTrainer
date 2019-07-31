import {uiSagas, updateBrowserHistory} from './uiSagas'
import {takeEvery, all} from '@redux-saga/core/effects'
import {UiActions, createUiNavigateAction} from '../ui/uiActions'
import {Page} from '../../types/page'

jest.mock('history', () => {
  const push = jest.fn()
  return {
    createBrowserHistory: () => ({
      push,
    }),
  }
})

test('ui root saga', () => {
  const iterator = uiSagas()
  const {value} = iterator.next()
  expect(value).toEqual(
    all([takeEvery(UiActions.NAVIGATE, updateBrowserHistory)])
  )
})

describe('updateBrowserHistory', () => {
  test('no parameters', () => {
    const mockFn = jest.requireMock('history').createBrowserHistory().push

    const action = createUiNavigateAction(Page.Trainees)
    const iterator = updateBrowserHistory(action)

    iterator.next()
    expect(mockFn).toHaveBeenCalledWith(`trainees`)

    const {done} = iterator.next()
    expect(done).toBe(true)
  })

  test('with parameters', () => {
    const mockFn = jest.requireMock('history').createBrowserHistory().push

    const action = createUiNavigateAction(Page.Trainee, {A: 'A'})
    const iterator = updateBrowserHistory(action)

    iterator.next()
    expect(mockFn).toHaveBeenCalledWith(`trainee?A=A`)

    const {done} = iterator.next()
    expect(done).toBe(true)
  })
})
