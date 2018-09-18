import Immutable from 'immutable'
import { takeLatest } from 'redux-saga/effects'
import { socket } from '@redux/store'

export const defaultState = Immutable.List()
const TYPE = { LOAD: 'LOAD', NEW: 'PINGS.NEW', MORE: 'PINGS.MORE', FROMMORE: 'PINGS.FROMMORE' }
export const loadMoreAction = (last: number) => dispatch => dispatch({ type: TYPE.MORE, payload: last })
export const pingsReducer = (state = defaultState, action) => {
  if (action.type === TYPE.LOAD) {
    return Immutable.fromJS(action.payload.pings)
  } else if (action.type === TYPE.NEW) {
    return state.filter(p => action.payload.counter !== p.get('counter')).push(Immutable.fromJS(action.payload))
  } else if (action.type === TYPE.FROMMORE) {
    return state.concat(Immutable.fromJS(action.payload))
  }
  return state
}
export function* pingSaga() {
  yield takeLatest(TYPE.MORE, loadMoreSaga)
}
function* loadMoreSaga(action) {
  const last = action.payload
  const json = JSON.stringify({
    type: 'more',
    last,
  })
  socket.send(json)
}
