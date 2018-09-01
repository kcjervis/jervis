import { StateType } from 'typesafe-actions'
import { RouterAction, LocationChangeAction } from 'react-router-redux'
type ReactRouterAction = RouterAction | LocationChangeAction
import { OrmAction } from '../redux/modules/orm'
import rootReducer from '../redux/rootReducer'

export type RootState = StateType<typeof rootReducer>
export type RootAction = ReactRouterAction | OrmAction
