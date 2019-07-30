import * as firebase from 'firebase/app'
import {db} from './db'
import {Collection} from '../types/Collection'

export class BatchBuilder {
  batch: firebase.firestore.WriteBatch

  constructor() {
    this.batch = db.batch()
  }

  delete(collection: Collection, id: string) {
    this.batch.delete(db.collection(collection).doc(id))
    return this
  }

  async execute() {
    return await this.batch.commit()
  }
}
