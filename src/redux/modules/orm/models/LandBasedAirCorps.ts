import { attr, fk, Model, ORMId, TableState } from 'redux-orm'
import { getType } from 'typesafe-actions'

import actions, { OrmAction } from '../actions'

export interface ILandBasedAirCorpsStateItem {
  index: number
  operationId: number
}

export type ILandBasedAirCorpsState = TableState<ILandBasedAirCorpsStateItem & ORMId>

export default class LandBasedAirCorps extends Model<ILandBasedAirCorpsStateItem> {
  public static modelName = 'LandBasedAirCorps'

  public static fields = {
    id: attr(),
    index: attr(),
    operationId: fk({
      to: 'Operation',
      as: 'operation',
      relatedName: 'landBasedAirCorpsList'
    })
  }

  public static reducer(action: OrmAction, landBasedAirCorpsTable: typeof LandBasedAirCorps) {
    switch (action.type) {
      case getType(actions.createOperation): {
        const operationId = action.payload.id

        const lbacs = Array.from({ length: 3 }, (_, index) => ({
          operationId,
          index
        }))
        lbacs.forEach(lbac => {
          landBasedAirCorpsTable.create(lbac)
        })
        break
      }
      case getType(actions.updateLandBasedAirCorps): {
        const { payload } = action
        const airCorps = landBasedAirCorpsTable.withId(payload.id)
        if (airCorps) {
          airCorps.update(payload)
        }
        break
      }
    }
  }
}
