import { routerReducer, RouterState } from 'react-router-redux'
import { combineReducers } from 'redux'

import { IORMState, reducer as orm } from './modules/orm'

import { EquipmentsState, reducer as equipments } from './modules/equipments'
import { FleetsState, reducer as fleets } from './modules/fleets'
import { OperationsState, reducer as operations } from './modules/operations'
import { reducer as ships, ShipsState } from './modules/ships'

export interface IState {
  readonly orm: IORMState
  readonly routerReducer: RouterState
  readonly ships: ShipsState
  readonly equipments: EquipmentsState
  readonly fleets: FleetsState
  readonly operations: OperationsState
}

export default combineReducers<IState>({
  orm,
  routerReducer,
  equipments,
  ships,
  fleets,
  operations
})
