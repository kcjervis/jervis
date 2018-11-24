import { List, Map, Record } from 'immutable'
import { ActionType, createStandardAction, getType } from 'typesafe-actions'

interface IEquipmentState {
  id: string
  masterId: number
  improvement: number
  proficiency: number
}

class EquipmentRecord extends Record<IEquipmentState>({ id: '', masterId: 0, improvement: 0, proficiency: 0 }) {}

const upsertEquipment = createStandardAction('UPSERT_EQUIPMETN')<Partial<IEquipmentState>>()

export const actions = { upsertEquipment }

export type EquipmentsAction = ActionType<typeof actions>

export type EquipmentsState = List<EquipmentRecord>

export const reducer = (state: EquipmentsState = List<EquipmentRecord>(), action: EquipmentsAction) => {
  switch (action.type) {
    case getType(upsertEquipment): {
      const { payload } = action
      return state.map(equipRecord => {
        if (equipRecord.id === payload.id) {
          return equipRecord.merge(payload)
        }
        return equipRecord
      })
    }
    default:
      return state
  }
}
