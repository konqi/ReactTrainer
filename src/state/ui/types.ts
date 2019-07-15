import {UiNavigationFSA} from './uiActions'
import {Page} from '../../types/page'
import {ParameterMap} from '../../types/ParameterMap'

export interface UiState {
  page?: Page
  params?: ParameterMap
}
export type UiFSAs = UiNavigationFSA
