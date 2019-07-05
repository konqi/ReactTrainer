import React, {useReducer} from 'react'
import './App.css'
import {ApplicationContext} from './context'
import {initialApplicationState, rootReducer} from './state'
import {CreateTrainee, TraineeList} from './trainee'

const App: React.FC = () => {
  const [state, dispatch] = useReducer(rootReducer, initialApplicationState)

  return (
    <div className="App">
      <ApplicationContext.Provider value={{state, dispatch}}>
        <CreateTrainee />
        <TraineeList />
      </ApplicationContext.Provider>
    </div>
  )
}

export default App
