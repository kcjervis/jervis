import { attr, Model, ORMId, TableState } from 'redux-orm'
import { getType } from 'typesafe-actions'

import actions, { OrmAction } from '../actions'

export interface IOperationStateItem {
  index: number
  name: string
}

export type IOperationState = TableState<IOperationStateItem & ORMId>

export default class Operation extends Model<IOperationStateItem> {
  public static modelName = 'Operation'

  public static fields = {
    id: attr(),
    index: attr(),
    name: attr()
  }

  public static reducer(action: OrmAction, operationTable: typeof Operation, session: any) {
    switch (action.type) {
      case getType(actions.createOperation):
        operationTable.create(action.payload)
        break
      case getType(actions.updateOperation): {
        const { payload } = action
        const operation = operationTable.withId(payload.id)
        if (operation) {
          operation.update(payload)
        }
        break
      }
      case getType(actions.removeOperation): {
        const { payload } = action
        const operation = operationTable.withId(payload)
        operation.fleets.delete()
        operation.landBasedAirCorpsList.delete()
        operation.delete()
        session.Ship.filter((ship: IUserData) => ship.fleetId === null).delete()
        session.Equipment.filter((equip: IUserData) => equip.shipId === null).delete()
        interface IUserData {
          fleetId?: number
          shipId?: number
        }
        break
      }
    }
  }
}
