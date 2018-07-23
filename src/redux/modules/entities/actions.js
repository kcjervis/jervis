import { createAction, createActions } from 'redux-actions'

export const CREATE_OPERATION = 'CREATE_OPERATION'
export const REMOVE_OPERATION = 'REMOVE_OPERATION'
export const SET_SHIP = 'SET_SHIP'
export const REMOVE_SHIP = 'REMOVE_SHIP'
export const SET_EQUIPMENT = 'SET_EQUIPMENT'
export const REMOVE_EQUIPMENT = 'REMOVE_EQUIPMENT'
export const SORT_OPERATION_INDEX = 'SORT_OPERATION_INDEX'
export const CHANGE_SHIP_INDEX = 'CHANGE_SHIP_INDEX'
export const CHANGE_ENTITY_INDEX = 'CHANGE_ENTITY_INDEX'

const createNewShip = ({ id, slots }) => ({
  id,
  changedStats: {},
  slots: [...slots],
  equipments: slots.map(s => null),
  expansionEquipment: null
})

const createChangeIndex = (tableName, listName) =>
  createAction(CHANGE_ENTITY_INDEX, payload => ({
    ...payload,
    tableName,
    listName
  }))

export default {
  ...createActions(
    {
      [SET_SHIP]: payload => ({ ...payload, ship: createNewShip(payload.ship) })
    },
    CREATE_OPERATION,
    REMOVE_OPERATION,
    REMOVE_SHIP,
    SET_EQUIPMENT,
    REMOVE_EQUIPMENT,
    SORT_OPERATION_INDEX,
    CHANGE_ENTITY_INDEX
  ),
  changeShipIndex: createChangeIndex('fleets', 'ships'),
  changeEquipmentIndex: createChangeIndex('ships', 'equipments')
}
