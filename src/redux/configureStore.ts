import { History } from 'history'
import { routerMiddleware } from 'react-router-redux'
import { applyMiddleware, compose, createStore } from 'redux'

import rootReducer from './rootReducer'

export default function configureStore(history: History, initialState: any = {}) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(routerMiddleware(history)),
      (window as any).__REDUX_DEVTOOLS_EXTENSION__ ? (window as any).__REDUX_DEVTOOLS_EXTENSION__() : (x: any) => x
    )
  )

  return store
}
