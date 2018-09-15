import { RouteComponentProps } from 'react-router'
import { createSelector, QuerySet } from 'redux-orm'
import { EquipmentModel, ShipModel } from '../../../calculator'
import { RootState } from '../../../types'
import orm from './models'

const ormStateSelector = (state: RootState) => state.orm

const sessionSelector = createSelector(orm, ormStateSelector, session => session)

const toRefArrayByIndex = <F extends { index: number }>(querySet: QuerySet<F>, length: number) => {
  const array = Array.from({ length })
  querySet.toRefArray().forEach(query => (array[query.index] = query))
  return array
}

export const operationsSelector = createSelector(orm, ormStateSelector, session =>
  session.Operation.all()
    .toModelArray()
    .map(operation => {
      const fleets = toRefArrayByIndex(operation.fleets, 4)
      const landBasedAirCorpsList = toRefArrayByIndex(operation.landBasedAirCorpsList, 3)
      return { ...operation.ref, fleets, landBasedAirCorpsList }
    })
    .sort(({ index: i1 }, { index: i2 }) => i1 - i2)
)

export const operationSelector = (state: RootState, props: { operationId: number }) =>
  operationsSelector(state).find(({ id }) => id === props.operationId)

export const landBasedAirCorpsListSelector = createSelector(orm, ormStateSelector, session =>
  session.LandBasedAirCorps.all()
    .toModelArray()
    .map(airCorps => {
      const equipments = toRefArrayByIndex(airCorps.equipments, 4)
      return { ...airCorps.ref, equipments }
    })
)

export const landBasedAirCorpsSelector = (state: RootState, props: { landBasedAirCorpsId: number }) =>
  landBasedAirCorpsListSelector(state).find(({ id }) => id === props.landBasedAirCorpsId)

export const fleetModelArraySelector = createSelector(orm, ormStateSelector, session =>
  session.Fleet.all()
    .toModelArray()
    .map(fleet => {
      const ships = toRefArrayByIndex(fleet.ships, 6)
      return { ...fleet.ref, ships }
    })
)

export const fleetSelector = (state: RootState, props: { fleetId: number }) =>
  fleetModelArraySelector(state).find(({ id }) => id === props.fleetId)

export const shipModelArraySelector = createSelector(orm, ormStateSelector, session =>
  session.Ship.all()
    .toModelArray()
    .map(ship => {
      const equipments = toRefArrayByIndex(ship.equipments, ship.slots.length + 1)
      return { ...ship.ref, equipments }
    })
)

export const shipSelector = (state: RootState, props: { shipId: number }) =>
  shipModelArraySelector(state).find(({ id }) => id === props.shipId)

export const equipmentModelArraySelector = createSelector(orm, ormStateSelector, session =>
  session.Equipment.all()
    .toModelArray()
    .map(equip => new EquipmentModel(equip.ref))
)

export const equipmentSelector = (state: RootState, props: { equipmentId: number }) =>
  equipmentModelArraySelector(state).find(({ id }) => id === props.equipmentId)

export default {
  operationsSelector,
  operationSelector,
  landBasedAirCorpsSelector,
  landBasedAirCorpsListSelector,
  fleetSelector,
  shipSelector,
  equipmentSelector
}
