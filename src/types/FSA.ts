/**
 * Flux Standard Action
 */
export interface FSA<T = any, P = any, M = any> {
  type: T
  payload?: P
  error?: boolean
  meta?: M
}
