import { reducer, ApplicationState, Action, Trainee } from "./reducer";
import { ActionType } from "./actions";

describe("reducer", () => {
  it("should add trainee to state with ADD_TRAINEE action", () => {
    const initialState: ApplicationState = {
      trainees: []
    };
    const newTrainee: Trainee = {
      name: "Tester",
      price: 1500
    };
    const action: Action = {
      type: ActionType.ADD_TRAINEE,
      payload: newTrainee
    };

    expect(initialState.trainees.length).toBe(0);
    const state = reducer(initialState, action);
    expect(state.trainees.length).toBeGreaterThan(0);
    expect(state).toEqual({
      ...initialState,
      trainees: [newTrainee]
    });
  });
});
