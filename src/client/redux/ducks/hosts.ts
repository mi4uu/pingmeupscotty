import Immutable from 'immutable'
import { takeLatest } from 'redux-saga/effects'
import { socket } from '@redux/store'
export const defaultState = Immutable.List()
const TYPE = {
  ADD: 'HOST.ADD',
  ADDED: 'HOST.ADDED',
  REMOVE: 'HOST.REMOVE',
  PURGE: 'HOST.PURGE',
  REMOVED: 'HOST.REMOVED',
  PURGED: 'HOST.PURGED',
  LOAD: 'LOAD',
}
export const addHostAction = (hostName: string, once: boolean) => dispatch =>
  dispatch({
    type: TYPE.ADD,
    payload: {
      hostName,
      once,
    },
  })

export const removeHostAction = (hostName: string) => dispatch =>
  dispatch({
    type: TYPE.REMOVE,
    payload: {
      hostName,
    },
  })
export const purgeHostsAction = () => dispatch =>
  dispatch({
    type: TYPE.PURGE,
    payload: {},
  })
export const hostsReducer = (state = defaultState, action) => {
  if (action.type === TYPE.ADDED) {
    return state.push(action.payload)
  } else if (action.type === TYPE.REMOVED) {
    return state.filter(host => host !== action.payload)
  } else if (action.type === TYPE.PURGED) {
    return state.clear()
  } else if (action.type === TYPE.LOAD) {
    return Immutable.fromJS(action.payload.hosts)
  }
  return state
}

export function* hostsSaga() {
  yield takeLatest([TYPE.ADD, TYPE.REMOVE, TYPE.PURGE], manageHostSaga)
}
function* manageHostSaga(action) {
  const payload = action.payload
  const json = JSON.stringify({
    type: 'add',
    host: payload.hostName,
    once: payload.once,
  })
  socket.send(json)
}
