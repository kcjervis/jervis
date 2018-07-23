import { createAction, createActions } from 'redux-actions'

const nameSpace = 'statuses'
export const SET_OPERATION_ID = nameSpace + 'SET_OPERATION_ID'

export default {
  ...createActions(SET_OPERATION_ID)
}
