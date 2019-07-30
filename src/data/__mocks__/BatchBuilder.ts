import {Collection} from '../../types/Collection'
import {db} from '../db'

const batchDeleteMock = jest.fn()
const batchCommitMock = jest.fn()

const BatchBuilderMock = {
  delete: batchDeleteMock,
  execute: batchCommitMock,
}

export class BatchBuilder {
  constructor() {
    return BatchBuilderMock
  }
}
