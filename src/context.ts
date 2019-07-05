import React from 'react'
import {Action, ApplicationState} from './state'

const useReducerInitialValue: {
  state?: ApplicationState
  dispatch?: React.Dispatch<Action>
} = {}

export const ApplicationContext = React.createContext(useReducerInitialValue)
