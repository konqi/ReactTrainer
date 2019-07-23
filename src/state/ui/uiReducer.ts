import {UiFSAs, UiState} from './types'
import {UiActions, UiNavigationFSA} from './uiActions'

export const initialUiState: UiState = {
  page: undefined,
}

export const reduceUi = (
  state: UiState = initialUiState,
  action: UiFSAs
): UiState => {
  switch (action.type) {
    case UiActions.NAVIGATE:
      const {page, params} = (action as UiNavigationFSA).payload!
      return {...state, page, params}
    default:
      return state
  }
}
