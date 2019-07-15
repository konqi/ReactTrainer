import {Trainee} from '../../types/Trainee'
import {
  IngestTraineeFSA,
  IngestTraineesFSA,
  ExpelTraineeFSA,
} from './traineeActions'

export type TraineeState = {[key: string]: Trainee}
export type TraineeFSAs = IngestTraineeFSA | IngestTraineesFSA | ExpelTraineeFSA
