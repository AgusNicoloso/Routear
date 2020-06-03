import { combineReducers } from 'redux' 
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'

import { UserFlow } from './UserFlow'

const flows = [
    new UserFlow('users'),
]

const mainReducer = combineReducers(
    flows.reduce((answer, flow) => { answer[flow.rootPath]=flow.reducer; return answer }, {})
)

const sagasMiddleware = createSagaMiddleware()

let store = createStore(
  mainReducer, 
  applyMiddleware(sagasMiddleware)
)

if (process.env.NODE_ENV !== 'production')  {
    const reduxLogger = createLogger({});
    store = createStore(
      mainReducer, 
      applyMiddleware(sagasMiddleware, reduxLogger)
      // applyMiddleware(sagasMiddleware)
    )
}


flows.forEach(flow => sagasMiddleware.run(flow.saga))

store.dispatch(requestIsLogged())

export { store }
