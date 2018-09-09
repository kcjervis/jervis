import { createSelector } from 'redux-orm'

import { EquipmentModel, ShipModel } from '../../../calculator/models'

import orm from './models'

const ormStateSelector = state => state.orm

const toRefArrayByIndex = (querySet, length) => {
  const array = Array.from({ length })
  querySet.toRefArray().forEach(query => {
    if (Number.isInteger(query.index)) {
      array[query.index] = query
    }
  })
  return array
}

export const operationsSelector = createSelector(
  orm,
  ormStateSelector,
  session => {
    return session.Operation.all()
      .toModelArray()
      .map(operation => {
        const fleets = toRefArrayByIndex(operation.fleets, 4)
        const landBasedAirCorpsList = toRefArrayByIndex(
          operation.landBasedAirCorpsList,
          3
        )
        return { ...operation.ref, fleets, landBasedAirCorpsList }
      })
      .sort(({ index: i1 }, { index: i2 }) => i1 - i2)
  }
)

export const operationSelector = (state, props) => {
  if (!props) {
    return false
  }
  const locationState = props.location.state
  if (!locationState) {
    return false
  }
  const { operationId, activeTab = 0 } = locationState

  return operationsSelector(state).find(({ id }) => id === operationId)
}

export const landBasedAirCorpsSelector = createSelector(
  orm,
  ormStateSelector,
  session =>
    session.LandBasedAirCorps.all()
      .toModelArray()
      .map(airCorps => {
        const equipments = toRefArrayByIndex(airCorps.equipments, 4)
        return { ...airCorps.ref, equipments }
      })
)

export const fleetsSelector = createSelector(orm, ormStateSelector, session =>
  session.Fleet.all()
    .toModelArray()
    .map(fleet => {
      const ships = toRefArrayByIndex(fleet.ships, 6)
      return { ...fleet.ref, ships }
    })
)

export const fleetSelector = (state, props) =>
  fleetsSelector(state).find(({ id }) => id === props.fleetId)

export const shipSelector = createSelector(orm, ormStateSelector, session =>
  session.Ship.all()
    .toModelArray()
    .map(ship => {
      const shipObj = ship.ref
      const { slots } = shipObj

      shipObj.equipments = toRefArrayByIndex(ship.equipments, slots.length).map(
        e => e && new EquipmentModel(e)
      )
      let expansionEquipment = ship.equipments
        .toRefArray()
        .find(e => e.index === 'expansionEquipment')
      if (expansionEquipment) {
        shipObj.expansionEquipment = new EquipmentModel(expansionEquipment)
      } else {
        shipObj.expansionEquipment = null
      }
      return new ShipModel(shipObj)
    })
)

export const equipmentSelector = createSelector(
  orm,
  ormStateSelector,
  session =>
    session.Equipment.all()
      .toModelArray()
      .map(equipment => new EquipmentModel(equipment.ref))
)

export default {
  operationsSelector,
  operationSelector,
  landBasedAirCorpsSelector,
  fleetSelector,
  shipSelector,
  equipmentSelector
}
