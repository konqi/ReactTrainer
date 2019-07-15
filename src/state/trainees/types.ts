import {Trainee} from '../../types/Trainee'
import {IngestTraineeFSA, IngestTraineesFSA} from './traineeActions'

export type TraineeState = {[key: string]: Trainee}
export type TraineeFSAs =
  | IngestTraineeFSA
  | IngestTraineesFSA
  | IngestTraineesFSA
