import {
  FleetRole,
  FleetType,
  IEquipmentDataObject,
  IFleetDataObject,
  IOperationDataObject,
  IShipDataObject,
  MasterData,
  ObjectFactory,
  Side
} from 'kc-calculator'

import { RootState } from '../../types'

const masterData = new MasterData()
const objectFactory = new ObjectFactory(masterData)

const fleetSideSelector = (state: RootState, fleetId: string) => {
  const operationRecord = state.operations.find(({ fleets }) => fleets.includes(fleetId))
  if (!operationRecord) {
    return undefined
  }
  return operationRecord.side
}

const fleetInfomationSelector = (state: RootState, shipId: string) => {
  const fleetRecord = state.fleets.find(({ ships }) => ships.includes(shipId))
  if (!fleetRecord) {
    return undefined
  }
  const side = fleetSideSelector(state, fleetRecord.id)
  if (!side) {
    return undefined
  }
  const { fleetRole, fleetType } = fleetRecord
  const position = fleetRecord.ships.indexOf(shipId)
  return {
    position,
    side,
    fleetRole,
    fleetType
  }
}

const shipRecordSelector = (state: RootState, shipId: string) => state.ships.find(({ id }) => id === shipId)

export const equipmentIdsSelector = (state: RootState, props: { shipId: string }) => {
  const shipRecord = shipRecordSelector(state, props.shipId)
  if (!shipRecord) {
    return []
  }
  return shipRecord.equipments.toArray()
}

const equipmentDataObjectSelector = (
  state: RootState,
  equipmentId: string | undefined
): IEquipmentDataObject | undefined => {
  if (!equipmentId) {
    return undefined
  }

  return state.equipments.find(({ id }) => id === equipmentId)
}

const shipDataObjectSelector = (state: RootState, shipId: string | undefined): IShipDataObject | undefined => {
  if (!shipId) {
    return undefined
  }

  const shipRecord = shipRecordSelector(state, shipId)
  if (!shipRecord) {
    return undefined
  }
  const { masterId, level } = shipRecord
  const equipments = shipRecord.equipments.map(equipId => equipmentDataObjectSelector(state, equipId)).toArray()

  return {
    masterId,
    level,
    equipments
  }
}

const fleetDataObjectSelector = (state: RootState, fleetId: string): IFleetDataObject | undefined => {
  const fleetRecord = state.fleets.find(({ id }) => id === fleetId)
  if (!fleetRecord) {
    return undefined
  }
  const { fleetRole, fleetType } = fleetRecord
  const ships = fleetRecord.ships.map(shipId => shipDataObjectSelector(state, shipId)).toArray()
  return { fleetRole, fleetType, ships }
}

const operationDataObjectSelector = (state: RootState, operationId: string): IOperationDataObject | undefined => {
  const operationRecord = state.operations.find(({ id }) => id === operationId)
  if (!operationRecord) {
    return undefined
  }

  const { side } = operationRecord
  const fleets = operationRecord.fleets
    .map(fleetId => fleetDataObjectSelector(state, fleetId))
    .toArray()
    .filter((fleet): fleet is IFleetDataObject => fleet !== undefined)
  return {
    side,
    fleets,
    landBase: [] as any[]
  }
}

export const operationSelector = (state: RootState, props: { operationId: string }) => {
  const { operationId } = props
  const operationDataObject = operationDataObjectSelector(state, operationId)
  if (!operationDataObject) {
    return undefined
  }

  return objectFactory.operationFactory.create(operationDataObject)
}

export const fleetSelector = (state: RootState, props: { fleetId: string }) => {
  const { fleetId } = props
  const fleetDataObject = fleetDataObjectSelector(state, fleetId)
  const side = fleetSideSelector(state, fleetId)
  if (!fleetDataObject || !side) {
    return undefined
  }

  return objectFactory.fleetFactory.create(fleetDataObject, side)
}

export const shipSelector = (state: RootState, props: { shipId: string }) => {
  const { shipId } = props
  const shipObjectData = shipDataObjectSelector(state, shipId)
  const fleetInfomation = fleetInfomationSelector(state, shipId)
  if (!shipObjectData || !fleetInfomation) {
    return undefined
  }

  return objectFactory.shipFactory.create(shipObjectData, fleetInfomation)
}

export const equipmentSelector = (state: RootState, props: { equipmentId: string }) => {
  const dataObject = equipmentDataObjectSelector(state, props.equipmentId)
  if (dataObject) {
    return objectFactory.equipmentFactory.create(dataObject)
  }
  return undefined
}
