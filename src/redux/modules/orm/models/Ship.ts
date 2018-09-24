import { attr, fk, Model, ORMId, TableState } from 'redux-orm'
import { getType } from 'typesafe-actions'

import actions, { OrmAction } from '../actions'

export interface IShipStateItem {
  index: number
  masterId: number
  fleetId: number
}

export type IShipState = TableState<IShipStateItem & ORMId>

export default class Ship extends Model<IShipStateItem> {
  public static modelName = 'Ship'

  public static fields = {
    id: attr(),
    masterId: attr(),
    name: attr(),
    fleetId: fk({
      to: 'Fleet',
      as: 'fleet',
      relatedName: 'ships'
    })
  }

  public static reducer(action: OrmAction, shipTable: typeof Ship, session: any) {
    switch (action.type) {
      case getType(actions.createShip): {
        const { equipments, id } = action.payload
        if (equipments) {
          const { maxId = -1 } = session.state.Ship.meta
          const shipId = id ? id : maxId + 1
          equipments.forEach(equipPayload => {
            if (equipPayload) {
              session.Equipment.create({ ...equipPayload, shipId, improvement: 0, internalProficiency: 0 })
            }
          })
        }
        shipTable.create({ ...action.payload, equipments: undefined })
        break
      }

      case getType(actions.updateShip): {
        const ship = shipTable.withId(action.payload.id)
        if (ship) {
          ship.update(action.payload)
        }
        break
      }
      case getType(actions.removeShip):
        shipTable.withId(action.payload).delete()
        session.Equipment.filter((equip: any) => equip.shipId === null).delete()
        break
    }
  }
}
