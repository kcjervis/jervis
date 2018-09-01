import { ORM, ORMCommonState } from 'redux-orm'

import Equipment, { IEquipmentState } from './Equipment'
import Fleet, { IFleetState } from './Fleet'
import LandBasedAirCorps, { ILandBasedAirCorpsState } from './LandBasedAirCorps'
import Operation, { IOperationState } from './Operation'
import Ship, { IShipState } from './Ship'

export interface IORMState extends ORMCommonState {
  Operation: IOperationState
  LandBasedAirCorps: ILandBasedAirCorpsState
  Fleet: IFleetState
  Ship: IShipState
  Equipment: IEquipmentState
}

interface IORMModels {
  Operation: typeof Operation
  LandBasedAirCorps: typeof LandBasedAirCorps
  Fleet: typeof Fleet
  Ship: typeof Ship
  Equipment: typeof Equipment
}

const orm = new ORM<IORMState>()
orm.register<IORMModels>(Operation, LandBasedAirCorps, Fleet, Ship, Equipment)

export default orm
