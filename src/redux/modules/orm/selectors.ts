import { RouteComponentProps } from 'react-router'
import { createSelector, QuerySet } from 'redux-orm'
import { EquipmentModel, ShipModel } from '../../../calculator'
import { RootState } from '../../../types'
import orm from './models'

const ormStateSelector = (state: RootState) => state.orm

const sessionSelector = createSelector(orm, ormStateSelector, session => session)

const toRefArrayByIndex = <F extends { index: number }>(querySet: QuerySet<F>, length: number) => {
  const array = Array.from({ length })
  querySet.toRefArray().forEach(query => array[query.index])
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

export const fleetModelArraySelector = ()

export const fleetSelector = (state: RootState, props: { fleetId: number }) => {
  const fleet = sessionSelector(state).Fleet.withId(props.fleetId)
  const ships = toRefArrayByIndex(fleet.ships, 6)
  return { ...fleet.ref, ships }
}

export const shipSelector = (state: RootState, props: { shipId: number }) => {
  const ship = sessionSelector(state).Ship.withId(props.shipId)
  const shipObj = ship.ref
  shipObj.equipments = toRefArrayByIndex(ship.equipments, shipObj.slots.length).map(e => e && e)
  return shipObj
}

export const equipmentSelector = (state: RootState, props: { equipmentId: number }) => {
  const equipment = sessionSelector(state).Equipment.withId(props.equipmentId)
  return equipment.ref
}

export default {
  operationsSelector,
  operationSelector,
  landBasedAirCorpsSelector,
  landBasedAirCorpsListSelector,
  fleetSelector,
  shipSelector,
  equipmentSelector
}
