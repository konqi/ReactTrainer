enum ActionType {
  ADD_TRAINEE
}

interface Action {
  type: ActionType;
  payload: Trainee;
}

interface Trainee {
  name: string;
  price: number;
}

interface ApplicationState {
  trainees: Trainee[];
}

function reducer(state: ApplicationState, action: Action): ApplicationState {
  switch (action.type) {
    case ActionType.ADD_TRAINEE:
      const newTrainees = [...state.trainees, action.payload];
      return { ...state, trainees: newTrainees };
    default:
      throw new Error();
  }
}
