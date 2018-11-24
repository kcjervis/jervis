import { Omit } from 'react-redux'
import { Dispatch } from 'redux'

import { ActionType, createStandardAction, getType } from 'typesafe-actions'

interface ICreateShipPayload { shipId: string; masterId: number; fleetId: string; index: number }
const createShip = createStandardAction('CREATE_SHIP')<ICreateShipPayload>()

const generateShip = (dispatch: Dispatch) => (payload: Omit<ICreateShipPayload, 'shipId'>) {
  dispatch(createShip({ shipId: Math.random().toString(), ...payload }))
}
