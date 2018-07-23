import { handleActions } from 'redux-actions'
import { Map as ImmutableMap, fromJS } from 'immutable'

import actions from './actions'

const initialState = fromJS({
  operationId: null
})

export default handleActions(
  {
    [actions.setOperationId]: (state, { payload }) =>
      state.set('operationId', payload)
  },
  initialState
)
