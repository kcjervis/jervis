import { routerReducer, RouterState } from 'react-router-redux'
import { combineReducers } from 'redux'

import { IORMState, reducer as orm } from './modules/orm'

export interface IState {
  readonly orm: IORMState
  readonly routerReducer: RouterState
}

export default combineReducers<IState>({
  orm,
  routerReducer
})
