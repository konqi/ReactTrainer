/**
 * Flux Standard Action
 */
export interface FSA<T = any, P = any> {
  type: T
  payload?: P
  error?: boolean
  meta?: any
}
