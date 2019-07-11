import {put, takeEvery, call} from '@redux-saga/core/effects'
import {Page} from '../../types/page'
import {
  UserIntend,
  AddTrainingIntendFSA,
  ShowTraineeDetailsIntendFSA,
} from '../intends/UserIntend'
import {createUiNavigateAction} from '../ui/uiActions'
import {db, DbCollection} from '../../db'
import {Session, sessionSchema} from '../../types/Session'
import {createAddSessionAction} from '../sessions/sessionActions'
import {normalize} from 'normalizr'

export function* sessionSagas() {
  yield takeEvery(UserIntend.ADD_SESSION, addSession)
  yield takeEvery(UserIntend.SHOW_TRAINEE_DETAILS, fetchTraineeSessions)
}

function* addSession(action: AddTrainingIntendFSA) {
  if (action.payload && action.meta && action.meta.traineeId) {
    try {
      const doc = {
        ...action.payload,
        traineeRef: action.meta!.traineeId,
      }
      const {id} = yield call(() =>
        db.collection(DbCollection.Session).add(doc)
      )

      const session: Session = {...doc, id}
      yield put(createAddSessionAction(session))
    } catch (e) {
      // yield some error
    }
  }
}

function* fetchTraineeSessions(action: ShowTraineeDetailsIntendFSA) {
  if (action.payload) {
    try {
      const result: firebase.firestore.QuerySnapshot = yield call(() =>
        db
          .collection(DbCollection.Session)
          .where('traineeRef', '==', action.payload)
          .where('datetime', '<', Date.now())
          .get()
      )
      const sessions: Session[] = result.docs.map(
        doc =>
          ({
            ...doc.data(),
            id: doc.id,
          } as Session)
      )

      console.log(sessions)
      const normalizedSessions = normalize(sessions, sessionSchema)
      yield console.log(normalizedSessions)
    } catch (e) {
      console.error(e)
      // yield some error
    }
  }
}
