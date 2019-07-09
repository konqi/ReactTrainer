import {UiFSAs, UiState} from './types'
import {UiActions, UiNavigationFSA} from './uiActions'
import {Page} from '../../types/page'
import {createBrowserHistory} from 'history'

const history = createBrowserHistory()

export const initialUiState: UiState = {
  page: Page.Trainees,
}

export const reduceUi = (
  state: UiState = initialUiState,
  action: UiFSAs
): UiState => {
  switch (action.type) {
    case UiActions.NAVIGATE:
      const {page, params} = (action as UiNavigationFSA).payload!
      history.push(page) // this is actually a side-effect
      return {...state, page, params}
    default:
      return state
  }
}
