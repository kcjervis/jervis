import { RouteComponentProps } from 'react-router'
import { createSelector as createOrmSelector, ModelWithFields, QuerySet } from 'redux-orm'
import { createSelector } from 'reselect'
import { EquipmentModel, FleetModel, LandBasedAirCorpsModel, OperationModel, ShipModel } from '../../../calculator'
import { RootState } from '../../../types'
import orm from './models'

const ormStateSelector = (state: RootState) => state.orm

const equipmentToModel = (equipment: ModelWithFields<any>) => new EquipmentModel(equipment.ref)

const shipToModel = (ship: ModelWithFields<any>) => {
  const equipments: EquipmentModel[] = ship.equipments.toModelArray().map(equipmentToModel)
  return new ShipModel({ ...ship.ref, equipments })
}

const landBasedAirCorpsToModel = (lbac: ModelWithFields<any>) => {
  const equipments: EquipmentModel[] = lbac.equipments.toModelArray().map(equipmentToModel)
  return new LandBasedAirCorpsModel({ ...lbac.ref, equipments })
}

const fleetToModel = (fleet: ModelWithFields<any>) => {
  const ships: ShipModel[] = fleet.ships.toModelArray().map(shipToModel)
  return new FleetModel({ ...fleet.ref, ships })
}

const operationToModel = (operation: ModelWithFields<any>) => {
  const fleets = operation.fleets.toModelArray().map(fleetToModel)
  const landBase = operation.landBase.toModelArray().map(landBasedAirCorpsToModel)
  return new OperationModel({ ...operation.ref, fleets, landBase })
}

export const equipmentModelArraySelector = createOrmSelector(orm, ormStateSelector, session =>
  session.Equipment.all()
    .toModelArray()
    .map(equipmentToModel)
)

export const equipmentSelector = (state: RootState, props: { equipmentId?: number }) =>
  equipmentModelArraySelector(state).find(({ id }) => id === props.equipmentId)

export const shipModelArraySelector = createOrmSelector(orm, ormStateSelector, session =>
  session.Ship.all()
    .toModelArray()
    .map(shipToModel)
)

export const shipSelector = (state: RootState, props: { shipId?: number }) =>
  shipModelArraySelector(state).find(({ id }) => id === props.shipId)

export const landBasedSelector = createOrmSelector(orm, ormStateSelector, session =>
  session.LandBasedAirCorps.all()
    .toModelArray()
    .map(landBasedAirCorpsToModel)
)

export const landBasedAirCorpsSelector = (state: RootState, props: { landBasedAirCorpsId: number }) =>
  landBasedSelector(state).find(({ id }) => id === props.landBasedAirCorpsId)

export const fleetModelArraySelector = createOrmSelector(orm, ormStateSelector, session =>
  session.Fleet.all()
    .toModelArray()
    .map(fleetToModel)
)

export const fleetSelector = (state: RootState, props: { fleetId: number }) =>
  fleetModelArraySelector(state).find(({ id }) => id === props.fleetId)

export const operationsSelector = createOrmSelector(orm, ormStateSelector, session =>
  session.Operation.all()
    .toModelArray()
    .map(operationToModel)
    .sort(({ index: i1 }, { index: i2 }) => i1 - i2)
)

export const operationSelector = (state: RootState, props: { operationId: number }) =>
  operationsSelector(state).find(({ id }) => id === props.operationId)

export default {
  operationsSelector,
  operationSelector,
  landBasedAirCorpsSelector,
  landBasedSelector,
  fleetSelector,
  shipSelector,
  equipmentSelector
}
