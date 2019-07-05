import {Trainee} from '../../types/trainee'
import {AddTraineeFSA, RemoveTraineeFSA} from './traineeActions'

export type TraineeState = Trainee[]
export type TraineeFSAs = AddTraineeFSA | RemoveTraineeFSA
