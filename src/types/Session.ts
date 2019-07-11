import {schema} from 'normalizr'

export interface Session {
  id: string
  datetime: Date
  payedAmount: number
  price?: number
  description?: string
  traineeRef: string
}

export const sessionSchema = new schema.Entity('session')
