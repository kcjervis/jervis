import { StateType } from 'typesafe-actions'
import { RouterAction, LocationChangeAction } from 'react-router-redux'
import { OrmAction } from '../redux/modules/orm'
import rootReducer from '../redux/rootReducer'
type ReactRouterAction = RouterAction | LocationChangeAction
export type RootState = StateType<typeof rootReducer>
export type RootAction = ReactRouterAction | OrmAction




