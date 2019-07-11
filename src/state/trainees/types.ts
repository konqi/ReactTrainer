import {Trainee} from '../../types/Trainee'
import {
  AddTraineeFSA,
  RemoveTraineeFSA,
  OpenTraineeFSA,
  AddTraineesFSA,
} from './traineeActions'

export type TraineeState = {[key: string]: Trainee}
export type TraineeFSAs =
  | AddTraineeFSA
  | AddTraineesFSA
  | RemoveTraineeFSA
  | OpenTraineeFSA
  | AddTraineesFSA
