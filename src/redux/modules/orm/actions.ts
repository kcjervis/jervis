import { ActionType, createStandardAction } from 'typesafe-actions'
import { ShipModel } from '../../../calculator'

export interface IOperationPayload {
  id: number
  index: number
}

export interface IEquipmentPayload {
  id?: number
  masterId?: number
  shipId?: number
  landBasedAirCorpsId?: number
  index?: number
  improvement?: number
  internalProficiency?: number
}

export const createOperation = createStandardAction('CREATE_OPERATION')<IOperationPayload>()
export const updateOperation = createStandardAction('UPDATE_OPERATION')<IOperationPayload>()
export const removeOperation = createStandardAction('REMOVE_OPERATION')<number>()
export const createEnemyOperation = createStandardAction('CREATE_ENEMY_OPERATION')<{
  ships: ShipModel[]
  escortShips?: ShipModel[]
  formation: string
}>()

export interface ILandBasedAirCorpsPayload {
  id: number
  index: number
}

export const updateLandBasedAirCorps = createStandardAction('UPDATE_LAND_BASED_AIR_CORPS')<ILandBasedAirCorpsPayload>()

export interface IShipPayload {
  id?: number
  masterId?: number
  index?: number
  slots?: number[]
  fleetId?: number
  equipments?: Array<IEquipmentPayload | null>
}

export interface IUpdateShipPayload extends IShipPayload {
  id: number
}

export const createShip = createStandardAction('CREATE_SHIP')<IShipPayload>()
export const updateShip = createStandardAction('UPDATE_SHIP')<IUpdateShipPayload>()
export const removeShip = createStandardAction('REMOVE_SHIP')<number>()

export interface IUpdateEquipmentPayload extends IEquipmentPayload {
  id: number
}

const createEquipmentAction = <T extends string>(type: T) => createStandardAction(type)<IEquipmentPayload>()
export const createEquipment = createEquipmentAction('CREATE_EQUIPMENT')
export const updateEquipment = createStandardAction('UPDATE_EQUIPMENT')<IUpdateEquipmentPayload>()
export const upsertEquipment = createEquipmentAction('UPSERT_EQUIPMENT')
export const removeEquipment = createStandardAction('REMOVE_EQUIPMENT')<number>()
export const swapEquipments = createStandardAction('SWAP_EQUIPMENTS')<
  Array<{ equipmentId?: number; index: number; shipId?: number; landBasedAirCorpsId?: number }>
>()

const actions = {
  createOperation,
  updateOperation,
  removeOperation,
  createEnemyOperation,

  updateLandBasedAirCorps,

  createShip,
  updateShip,
  removeShip,

  createEquipment,
  updateEquipment,
  upsertEquipment,
  removeEquipment,
  swapEquipments
}

export type OrmAction = ActionType<typeof actions>

export default actions
