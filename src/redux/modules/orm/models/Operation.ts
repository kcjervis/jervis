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
      case getType(actions.createOperation): {
        const { maxId = -1 } = session.state.Operation.meta
        const operationId = action.payload.id ? action.payload.id : maxId + 1
        const operationPayload = {
          id: operationId,
          index: operationId
        }
        operationTable.create(operationPayload)
        ;[0, 1, 2, 3].forEach(index => {
          session.Fleet.create({ operationId, index })
        })
        ;[0, 1, 2].forEach(index => {
          session.LandBasedAirCorps.create({
            operationId,
            index,
            slots: [18, 18, 18, 18]
          })
        })

        break
      }
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
        operation.landBase.delete()
        operation.delete()
        session.Ship.filter((ship: IUserData) => ship.fleetId === null).delete()
        session.Equipment.filter((equip: IUserData) => equip.shipId === null).delete()
        interface IUserData {
          fleetId?: number
          shipId?: number
        }
        break
      }

      case getType(actions.createEnemyOperation): {
        const { formation } = action.payload

        operationTable.create({ formation })
        const operationId = session.state.Operation.meta.maxId

        const mainShips = action.payload.ships.slice(0, 6)
        const escortShips = action.payload.ships.slice(6, 12)

        const createFleet = (ships: typeof action.payload.ships, fleetIndex: number) => {
          session.Fleet.create({ operationId, index: fleetIndex })
          const fleetId = session.state.Fleet.meta.maxId
          ships.forEach((ship, shipIndex) => {
            session.Ship.create({ fleetId, masterId: ship.masterId, index: shipIndex })
            const shipId = session.state.Ship.meta.maxId
            ship.master.equipments.forEach((equip, equipIndex) => {
              if (!equip) {
                return
              }
              session.Equipment.create({
                masterId: equip.id,
                shipId,
                index: equipIndex,
                improvement: 0,
                internalProficiency: 0
              })
            })
          })
        }
        createFleet(mainShips, 0)
        if (escortShips && escortShips.length > 0) {
          operationTable.withId(operationId).update({ isCombinedFleet: true })
          createFleet(escortShips, 1)
        }
        break
      }
    }
  }
}
