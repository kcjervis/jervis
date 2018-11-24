import { List, Record } from 'immutable'
import { ActionType, createStandardAction, getType } from 'typesafe-actions'

import actions, { KcDataBaseAction } from './actions'

interface IShipState {
  id: string
  masterId: number
  level: number
  equipments: List<string | undefined>
}

export class ShipRecord extends Record<IShipState>({ id: '', masterId: 0, level: 0, equipments: List() }) {
  public setEquipment(index: number, equipmentId: string) {
    return this.setIn(['equipments', index], equipmentId)
  }
}

export type ShipsState = List<ShipRecord>

export const reducer = (state: ShipsState = List<ShipRecord>(), action: KcDataBaseAction) => {
  switch (action.type) {
    case getType(actions.createShip): {
      return state
    }

    // case getType(actions.setEquipmentToShip): {
    //   const { shipId, index, equipmentId } = action.payload
    //   return state.map(shipRecord => {
    //     if (shipRecord.id === shipId) {
    //       return shipRecord.setEquipment(index, equipmentId)
    //     }
    //     return shipRecord
    //   })
    // }

    default:
      return state
  }
}
