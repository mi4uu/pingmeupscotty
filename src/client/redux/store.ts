import {
  connectRouter,
  routerMiddleware,
  // @ts-ignore
} from 'connected-react-router/immutable'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from '@redux/sagas'

import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'

import { initialState, rootReducer } from '@redux/reducers'
import { setDisconnectedAction, setConnectedAction } from '@redux/ducks/connection'
const sagaMiddleware = createSagaMiddleware()

const enhancers = [applyMiddleware(thunk), applyMiddleware(sagaMiddleware)]
// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(rootReducer, initialState, composeEnhancers(...enhancers))
sagaMiddleware.run(rootSaga)
export const socket = new WebSocket('ws://localhost:3000')

// Connection opened
socket.addEventListener('open', event => {
  store.dispatch(setConnectedAction())
  socket.send(JSON.stringify({ type: 'load' }))
})
socket.addEventListener('close', event => {
  store.dispatch(setDisconnectedAction())
})
// Listen for messages
socket.addEventListener('message', event => {
  try {
    const m = JSON.parse(event.data)
    store.dispatch(m)
  } catch (e) {
    console.log('error while converting json to object')
  }
})
export default store
