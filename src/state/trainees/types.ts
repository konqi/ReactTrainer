import {Trainee} from '../../types/Trainee'
import {AddTraineeFSA, RemoveTraineeFSA, OpenTraineeFSA} from './traineeActions'

export type TraineeState = Trainee[]
export type TraineeFSAs = AddTraineeFSA | RemoveTraineeFSA | OpenTraineeFSA
