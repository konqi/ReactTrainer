import {createStore} from 'redux'
import {ApplicationState} from '../state'
import {rootReducer} from '../state/rootReducer'
import {Trainee} from '../types/Trainee'
import {Session} from '../types/Session'

export const createMockStore = (initialApplicationState: ApplicationState) =>
  createStore(rootReducer, initialApplicationState)

export class TraineeBuilder {
  trainee: Trainee
  constructor() {
    this.trainee = {
      id: 'traineeId',
      name: 'Dummy Trainee',
      price: 15,
    } as Trainee
  }

  withId(id: string) {
    this.trainee.id = id
    return this
  }

  withName(name: string) {
    this.trainee.name = name
    return this
  }

  withPrice(price: number) {
    this.trainee.price = price
    return this
  }

  withSessionRef(sessionRef: string[]) {
    this.trainee.sessionsRef = sessionRef
    return this
  }

  build() {
    return this.trainee
  }
}

export class SessionBuilder {
  session: Session

  constructor(traineeId: string) {
    this.session = {
      id: 'sessionId',
      datetime: new Date(),
      payedAmount: 15,
      traineeRef: traineeId,
    }
  }

  withId(id: string) {
    this.session.id = id
    return this
  }

  withDatetime(datetime: Date) {
    this.session.datetime = datetime
    return this
  }

  withDescription(description: string) {
    this.session.description = description
    return this
  }

  withPayedAmount(payedAmount: number) {
    this.session.payedAmount = payedAmount
    return this
  }

  withPrice(price: number) {
    this.session.price = price
    return this
  }

  build() {
    return this.session
  }
}
