import React, { useReducer } from "react";
import "./App.css";
import { CreateTrainee } from "./CreateTrainee";
import {
  reducer,
  initialApplicationState,
  Action,
  ApplicationState
} from "./state/reducer";
import { TraineeList } from "./TraineeList";

const useReducerInitialValue: {
  state?: ApplicationState;
  dispatch?: React.Dispatch<Action>;
} = {};

export const ApplicationContext = React.createContext(useReducerInitialValue);

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialApplicationState);

  return (
    <div className="App">
      <ApplicationContext.Provider value={{ state, dispatch }}>
        <CreateTrainee />
        <TraineeList />
      </ApplicationContext.Provider>
    </div>
  );
};

export default App;
