import { attr, fk, Model, ORMId, TableState } from 'redux-orm'
import { getType } from 'typesafe-actions'

import actions, { OrmAction } from '../actions'

export interface IFleetStateItem {
  index: number
  operationId: number
}

export type IFleetState = TableState<IFleetStateItem & ORMId>

export default class Fleet extends Model<IFleetStateItem> {
  public static modelName = 'Fleet'

  public static fields = {
    id: attr(),
    index: attr(),
    operationId: fk({
      to: 'Operation',
      as: 'operation',
      relatedName: 'fleets'
    })
  }

  public static reducer(action: OrmAction, fleetTable: typeof Fleet) {
    switch (action.type) {
    }
  }
}
