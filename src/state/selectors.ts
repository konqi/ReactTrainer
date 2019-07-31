import {ApplicationState} from '.'

export const selectTraineeById = (state: ApplicationState, traineeId: string) =>
  state.trainees[traineeId]
