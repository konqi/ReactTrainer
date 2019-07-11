import {schema} from 'normalizr'

export interface Trainee {
  id: string
  name: string
  price: number
}

export const traineeSchema = new schema.Entity('trainee')
