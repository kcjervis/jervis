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

  public static reducer(action: OrmAction, shipTable: typeof Ship) {
    switch (action.type) {
      case getType(actions.createShip):
        shipTable.create(action.payload)
        break
      case getType(actions.updateShip): {
        const ship = shipTable.withId(action.payload.id)
        if (ship) {
          ship.update(action.payload)
        }
        break
      }
      case getType(actions.removeShip):
        shipTable.withId(action.payload).delete()
        break
    }
  }
}
