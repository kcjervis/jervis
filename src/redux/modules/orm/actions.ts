import { ActionType, createStandardAction } from 'typesafe-actions'

export interface IOperationPayload {
  id: number
  index: number
}

export const createOperation = createStandardAction('CREATE_OPERATION')<IOperationPayload>()
export const updateOperation = createStandardAction('UPDATE_OPERATION')<IOperationPayload>()
export const removeOperation = createStandardAction('REMOVE_OPERATION')<number>()

export interface ILandBasedAirCorpsPayload {
  id: number
  index: number
  operationId: number
}

export const updateLandBasedAirCorps = createStandardAction('UPDATE_LAND_BASED_AIR_CORPS')<ILandBasedAirCorpsPayload>()

export interface IShipPayload {
  id?: number
  masterId?: number
  index?: number
  slots?: number[]
  fleetId?: number
}

export interface IUpdateShipPayload extends IShipPayload {
  id: number
}

const createShipAtion = <T extends string>(type: T) => createStandardAction(type)<IShipPayload>()
export const createShip = createShipAtion('CREATE_SHIP')
export const updateShip = createStandardAction('UPDATE_SHIP')<IUpdateShipPayload>()
export const removeShip = createStandardAction('REMOVE_SHIP')<number>()

export interface IEquipmentPayload {
  id?: number
  masterId?: number
  shipId?: number
  landBasedAirCorpsId?: number
  index?: number | string
  improvement?: number
  internalProficiency?: number
}

export interface IUpdateEquipmentPayload extends IEquipmentPayload {
  id: number
}

const createEquipmentAction = <T extends string>(type: T) => createStandardAction(type)<IEquipmentPayload>()
export const createEquipment = createEquipmentAction('CREATE_EQUIPMENT')
export const updateEquipment = createStandardAction('UPDATE_EQUIPMENT')<IUpdateEquipmentPayload>()
export const upsertEquipment = createEquipmentAction('UPSERT_EQUIPMENT')
export const removeEquipment = createStandardAction('REMOVE_EQUIPMENT')<number>()

const actions = {
  createOperation,
  updateOperation,
  removeOperation,

  updateLandBasedAirCorps,

  createShip,
  updateShip,
  removeShip,

  createEquipment,
  updateEquipment,
  upsertEquipment,
  removeEquipment
}

export type OrmAction = ActionType<typeof actions>

export default actions
