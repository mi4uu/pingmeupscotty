import Immutable from 'immutable'
import { combineReducers } from 'redux-immutable'
import { connectionReducer } from '@redux/ducks/connection'
import { hostsReducer } from '@redux/ducks/hosts'
import { pingsReducer } from '@redux/ducks/pings'
export const initialState = Immutable.Map()
export const rootReducer = combineReducers({
  hosts: hostsReducer,
  pings: pingsReducer,
  connected: connectionReducer,
})
export default rootReducer
