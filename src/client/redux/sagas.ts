import { all, fork } from 'redux-saga/effects'
import { hostsSaga } from '@redux/ducks/hosts'
import { pingSaga } from '@redux/ducks/pings'

export function* rootSaga() {
  yield all([fork(hostsSaga), fork(pingSaga)])
}
