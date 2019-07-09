import {FSA} from '../../types/FSA'
import {Page} from '../../types/page'
import {ParameterMap} from '../../types/ParameterMap'

export enum UiActions {
  NAVIGATE = '[UI] navigate',
}

type UiNavigationPayload = {
  page: Page
  params?: ParameterMap
}
export type UiNavigationFSA = FSA<UiActions.NAVIGATE, UiNavigationPayload>
export const createUiNavigateAction = (
  page: Page,
  params?: ParameterMap
): UiNavigationFSA => ({
  type: UiActions.NAVIGATE,
  payload: {
    page,
    params,
  },
})
