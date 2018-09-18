import Immutable from 'immutable'
export const defaultState = false
const TYPE = { CONNECTION: 'CONNECTION' }
export const setConnectedAction = () => ({ type: TYPE.CONNECTION, payload: true })
export const setDisconnectedAction = () => ({ type: TYPE.CONNECTION, payload: false })
export const connectionReducer = (state = defaultState, action) => {
  if (action.type === TYPE.CONNECTION) {
    return action.payload
  }
  return state
}
