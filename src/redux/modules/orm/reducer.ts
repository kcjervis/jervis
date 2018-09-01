import { createReducer } from 'redux-orm'

import orm, { IORMState } from './models'

export { IORMState }
export default createReducer<IORMState>(orm)
