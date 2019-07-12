import {schema} from 'normalizr'

export interface Trainee {
  id: string
  name: string
  price: number
  sessionsRef?: string[]
}

export const traineeSchema = new schema.Entity('trainee')
