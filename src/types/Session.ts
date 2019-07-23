import {schema} from 'normalizr'
import orderBy from 'lodash/orderBy'
import {isBefore, isAfter} from 'date-fns'

export interface Session {
  id: string
  datetime: Date
  payedAmount: number
  price?: number
  description?: string
  traineeRef: string
}

export const sessionSchema = new schema.Entity('session')

// TODO possibly refactor to improve performance
export const findFirstBeforeAndAfterDate = (
  date: Date,
  sessions?: Session[]
) => {
  let previousSession = undefined
  let upcomingSession = undefined
  if (typeof sessions === 'undefined' || sessions.length < 1) {
    return {previousSession, upcomingSession}
  }
  // order sessions by time
  const orderedSessions = orderBy(sessions, session =>
    session.datetime.getTime()
  )

  // find first session before and after current date
  for (let session of orderedSessions) {
    if (isBefore(session.datetime, date)) {
      previousSession = session
    } else if (isAfter(session.datetime, date)) {
      upcomingSession = session
      break
    }
  }

  return {previousSession, upcomingSession}
}
