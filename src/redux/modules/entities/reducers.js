import { handleActions } from 'redux-actions'
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable'

import actions from './actions'

const uuid = a =>
  a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid)

const getUniqueId = () =>
  Date.now().toString(36) +
  '-' +
  Math.random()
    .toString(36)
    .slice(2)

const getUniqueIds = n =>
  n &&
  Array(n)
    .fill(null)
    .map(getUniqueId)

const getChildIds = (state, parentName, childName) =>
  state
    .get(parentName)
    .reduce((ids, e) => ids.concat(e.get(childName)), ImmutableList())

const filterByIds = (state, key, ids) => {
  return state.update(key, entity =>
    entity.filter(e => ids.includes(e.get('uniqueId')))
  )
}

const sweepEntity = (state, key, listName) =>
  filterByIds(state, listName, getChildIds(state, key, listName))

const sweepEquipments = state => {
  const equipmentIds = getChildIds(state, 'ships', 'equipments').concat(
    getChildIds(state, 'airSquadrons', 'equipments'),
    getChildIds(state, 'ships', 'expansionEquipment')
  )
  return filterByIds(state, 'equipments', equipmentIds)
}

const sweepShips = state => {
  state = sweepEntity(state, 'fleets', 'ships')
  state = sweepEquipments(state)
  return state
}

const sweepEntities = state => {
  state = filterByIds(state, 'operations', state.get('operationIds'))
  state = sweepEntity(state, 'operations', 'fleets')
  state = sweepEntity(state, 'operations', 'airSquadrons')
  state = sweepShips(state)
  return state
}

const initialState = fromJS({
  operationIds: [],
  operations: {},
  fleets: {},
  ships: {},
  equipments: {},
  airSquadrons: {}
})

export default handleActions(
  {
    [actions.createOperation]: (state, action) => {
      const uniqueId = getUniqueId()
      const fleets = getUniqueIds(4)
      const airSquadrons = getUniqueIds(3)
      return state.withMutations(mutablState => {
        mutablState
          .update('operationIds', ids => ids.push(uniqueId))
          .setIn(
            ['operations', uniqueId],
            fromJS({ uniqueId, fleets, airSquadrons })
          )
        for (const uniqueId of fleets) {
          mutablState.setIn(
            ['fleets', uniqueId],
            fromJS({ uniqueId, ships: Array(6) })
          )
        }
        for (const uniqueId of airSquadrons) {
          mutablState.setIn(
            ['airSquadrons', uniqueId],
            fromJS({ uniqueId, equipments: [] })
          )
        }
      })
    },
    [actions.removeOperation]: (state, action) => {
      const index = action.payload
      return state.withMutations(mutablState => {
        mutablState.deleteIn(['operationIds', index])
        sweepEntities(mutablState)
      })
    },
    [actions.setShip]: (state, action) => {
      const { fleetsId, index, ship } = action.payload
      const uniqueId = getUniqueId()
      return state.withMutations(mutablState => {
        mutablState
          .setIn(['ships', uniqueId], fromJS({ ...ship, uniqueId }))
          .setIn(['fleets', fleetsId, 'ships', index], uniqueId)
      })
    },
    [actions.removeShip]: (state, action) => {
      const { fleetsId, index } = action.payload
      return state.withMutations(mutablState => {
        mutablState.setIn(['fleets', fleetsId, 'ships', index], null)
        sweepShips(mutablState)
      })
    },
    [actions.setEquipment]: (state, action) => {
      const { shipsId, airSquadronsId, index, id } = action.payload
      let parentName, parentId
      if (shipsId) [parentName, parentId] = ['ships', shipsId]
      else [parentName, parentId] = ['airSquadrons', airSquadronsId]
      const uniqueId = getUniqueId()
      return state.withMutations(mutablState => {
        mutablState.setIn([parentName, parentId, 'equipments', index], uniqueId)
        if (index === 'expansionEquipment') {
          mutablState.setIn(
            [parentName, parentId, 'expansionEquipment'],
            uniqueId
          )
        } else {
          mutablState.setIn(
            [parentName, parentId, 'equipments', index],
            uniqueId
          )
        }
        mutablState.setIn(['equipments', uniqueId], fromJS({ id, uniqueId }))
      })
    },
    [actions.removeEquipment]: (state, action) => {
      const { parentsName, parentsId, index } = action.payload
      return state.withMutations(mutablState => {
        mutablState.setIn([parentsName, parentsId, 'equipments', index], null)
        sweepEquipments(mutablState)
      })
    },
    [actions.sortOperationIndex]: (state, action) => {
      const { dragIndex, hoverIndex } = action.payload
      return state.update('operationIds', ids => {
        const dragId = ids.get(dragIndex)
        return ids.delete(dragIndex).splice(hoverIndex, 0, dragId)
      })
    },
    [actions.changeEntityIndex]: (state, action) => {
      const { tableName, listName, dragItem, dropItem } = action.payload
      const createPath = (tableName, listName, item) => {
        const { index } = item
        const path = [tableName, item[tableName + 'Id']]
        if (index === 'expansionEquipment') path.push(index)
        else path.push(listName, index)
        return path
      }

      const dragPath = createPath(tableName, listName, dragItem)
      const dropPath = createPath(tableName, listName, dropItem)
      const dragId = state.getIn(dragPath)
      const dropId = state.getIn(dropPath)
      return state.setIn(dragPath, dropId).setIn(dropPath, dragId)
    }
  },
  initialState
)
