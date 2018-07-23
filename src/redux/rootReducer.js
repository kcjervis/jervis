// @flow

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import test from './modules/test'
import entities from './modules/entities'

export default combineReducers({
  entities,
  routerReducer,
  test
})
