import { attr, fk, Model, ORMId, TableState } from 'redux-orm'
import { getType } from 'typesafe-actions'

import actions, { OrmAction } from '../actions'

export interface IEquipmentStateItem {
  index: number
  masterId: number
  shipId?: number
  landBasedAirCorpsId?: number
  improvement: number
  internalProficiency: number
}

export type IEquipmentState = TableState<IEquipmentStateItem & ORMId>

export default class Equipment extends Model<IEquipmentStateItem> {
  public static modelName = 'Equipment'

  public static fields = {
    id: attr(),
    index: attr(),
    masterId: attr(),
    shipId: fk({
      to: 'Ship',
      as: 'ship',
      relatedName: 'equipments'
    }),
    landBasedAirCorpsId: fk({
      to: 'LandBasedAirCorps',
      as: 'landBasedAirCorps',
      relatedName: 'equipments'
    })
  }

  public static reducer(action: OrmAction, equipmentTable: typeof Equipment, session: any) {
    switch (action.type) {
      case getType(actions.createEquipment):
        equipmentTable.create(action.payload)
        break

      case getType(actions.updateEquipment): {
        const { payload } = action
        const equipment = equipmentTable.withId(payload.id)
        if (equipment) {
          equipment.update(payload)
        }
        break
      }

      case getType(actions.upsertEquipment):
        const { maxId = -1 } = session.state.Equipment.meta
        equipmentTable.upsert({ id: maxId + 1, ...action.payload })
        break

      case getType(actions.removeEquipment):
        equipmentTable.withId(action.payload).delete()
        break

      case getType(actions.swapEquipments): {
        const { payload } = action
        const [equipment0, equipment1] = payload.map(
          ({ equipmentId }) => equipmentId !== undefined && equipmentTable.withId(equipmentId)
        )
        if (equipment0) {
          const { index, shipId, landBasedAirCorpsId } = payload[1]
          equipment0.update({
            index,
            shipId,
            landBasedAirCorpsId
          })
        }
        if (equipment1) {
          const { index, shipId, landBasedAirCorpsId } = payload[0]
          equipment1.update({
            index,
            shipId,
            landBasedAirCorpsId
          })
        }
        break
      }
    }
  }
}
