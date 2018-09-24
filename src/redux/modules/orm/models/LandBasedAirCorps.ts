import { attr, fk, Model, ORMId, TableState } from 'redux-orm'
import { getType } from 'typesafe-actions'

import actions, { OrmAction } from '../actions'

import { EquipmentModel } from '../../../../calculator'

export interface ILandBasedAirCorpsStateItem {
  index: number
  operationId: number
  slots: number[]
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
      relatedName: 'landBase'
    }),
    slots: attr()
  }

  public static reducer(action: OrmAction, landBasedAirCorpsTable: typeof LandBasedAirCorps) {
    switch (action.type) {
      case getType(actions.upsertEquipment): {
        const { masterId, landBasedAirCorpsId, index } = action.payload
        if (masterId === undefined || landBasedAirCorpsId === undefined || index === undefined) {
          break
        }
        const airCorps = landBasedAirCorpsTable.withId(landBasedAirCorpsId)
        if (airCorps) {
          const { isReconnaissanceAircraft } = EquipmentModel.createEquipmentById(masterId).type.aircraftType
          const slots = airCorps.slots
          if (isReconnaissanceAircraft) {
            slots[index] = 4
          } else {
            slots[index] = 18
          }
          airCorps.update({ slots })
        }
        break
      }

      case getType(actions.swapEquipments): {
        const [props0, props1] = action.payload
        const id0 = props0.landBasedAirCorpsId
        const id1 = props1.landBasedAirCorpsId
        if (id0 === undefined || id1 === undefined) {
          break
        }

        const slots0 = landBasedAirCorpsTable.withId(id0).slots
        const slots1 = landBasedAirCorpsTable.withId(id1).slots

        const nextSlot0 = slots1[props1.index]
        const nextSlot1 = slots0[props0.index]

        slots0[props0.index] = nextSlot0
        slots1[props1.index] = nextSlot1
        break
      }
    }
  }
}
