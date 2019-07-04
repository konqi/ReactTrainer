import { ActionType } from "./actions";

export interface Action {
  type: ActionType;
  payload: Trainee;
}

export interface Trainee {
  name: string;
  price: number;
}

export interface ApplicationState {
  trainees: Trainee[];
}

export const initialApplicationState: ApplicationState = {
  trainees: []
};

export const reducer = (
  state: ApplicationState,
  action: Action
): ApplicationState => {
  switch (action.type) {
    case ActionType.ADD_TRAINEE:
      const newTrainees = [...state.trainees, action.payload];
      return { ...state, trainees: newTrainees };
    default:
      throw new Error();
  }
};
