import { List, Record } from 'immutable'
import { FleetRole, FleetType } from 'kc-calculator'
import { ActionType, createStandardAction, getType } from 'typesafe-actions'

interface IFleetState {
  id: string
  fleetType: FleetType
  fleetRole: FleetRole
  ships: List<string | undefined>
}

export class FleetRecord extends Record<IFleetState>({
  id: '',
  ships: List(),
  fleetType: FleetType.Single,
  fleetRole: FleetRole.MainFleet
}) {}

const createFleet = createStandardAction('CREATE_FLEET')<{ id: string }>()

export const actions = {
  createFleet
}

export type FleetsAction = ActionType<typeof actions>

export type FleetsState = List<FleetRecord>

export const reducer = (state: FleetsState = List<FleetRecord>(), action: FleetsAction) => {
  switch (action.type) {
    case getType(actions.createFleet): {
      const { id } = action.payload
      return state.push(new FleetRecord({ id, ships: List(new Array(6)) }))
    }

    default:
      return state
  }
}
