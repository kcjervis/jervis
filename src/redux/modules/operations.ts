import { List, Record } from 'immutable'
import { Side } from 'kc-calculator'
import { Dispatch } from 'redux'
import { action as typesafeAction, ActionType, createAction, createStandardAction, getType } from 'typesafe-actions'

import { actions as fleetActions } from './fleets'

import { IOperationDataObject } from 'kc-calculator'

interface IOperationState {
  id: string
  side: Side
  fleets: List<string>
}

export class OperationRecord extends Record<IOperationState>({ id: '', side: Side.Player, fleets: List<string>() }) {}

const createOperation = createStandardAction('CREATE_OPERATION')<{
  id: string
  side: Side
  fleets: string[]
}>()

const generateOperation = (dispatch: Dispatch) => {
  const createId = () => Math.random().toString()
  const fleets = Array.from({ length: 4 }, createId)
  fleets.forEach(fleetId => dispatch(fleetActions.createFleet({ id: fleetId })))
  const landBase = Array.from({ length: 3 }, createId)
  dispatch(actions.createOperation({ id: createId(), side: Side.Player, fleets }))
}

export const actions = {
  createOperation,
  generateOperation
}

export type OperationsAction = ActionType<typeof actions>

export type OperationsState = List<OperationRecord>

export const reducer = (state = List<OperationRecord>(), action: OperationsAction) => {
  switch (action.type) {
    case getType(actions.createOperation): {
      const { id, fleets } = action.payload
      const operationRecord = new OperationRecord({ id, fleets: List(fleets) })
      return state.push(operationRecord)
    }

    default:
      return state
  }
}
