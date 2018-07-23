// @flow

import * as types from './types'

type __ReturnType<B, F: (...any) => B> = B
type $ReturnType<F> = __ReturnType<*, F>

export type TestAction =
  | $ReturnType<typeof testIncrement>
  | $ReturnType<typeof testDropAction>

export const testIncrement = () => ({ type: types.TEST_INCREMENT })

export const testDropAction = (drag: number, drop: number) => ({
  type: types.TEST_DROP_ACTION,
  drag,
  drop
})

export default { testIncrement, testDropAction }
