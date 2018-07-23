// @flow

import * as types from './types'

import type { TestAction } from './actions'
export type TestState = {
  count: number,
  list: Array<string>
}

const initialState = { count: 0, list: ['red', 'purple', 'green', 'orange'] }

export default (state: TestState = initialState, action: TestAction) => {
  switch (action.type) {
    case types.TEST_INCREMENT:
      return {
        ...state,
        count: state.count + 1
      }
    case types.TEST_DROP_ACTION:
      const { list } = state
      const newList = [...list]
      newList[action.drag] = list[action.drop]
      newList[action.drop] = list[action.drag]
      return {
        ...state,
        list: newList
      }
    default:
      return state
  }
}
