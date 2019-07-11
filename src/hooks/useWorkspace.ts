import { useContext, useCallback } from 'react'
import useReactRouter from 'use-react-router'

import { ObservableOperation, WorkspaceStoreContext, WorkspaceItem, ObservableShip } from '../stores'
import useOperationStore from './useOperationStore'

const useWorkspace = () => {
  const workspaceStore = useContext(WorkspaceStoreContext)
  const { getOperation, getShip } = useOperationStore()
  const { history, location } = useReactRouter()

  const openOperation = useCallback(
    (operation: ObservableOperation) => {
      workspaceStore.createItem({ type: 'Operation', id: operation.id }).setActive()
      history.push('operation')
    },
    [workspaceStore]
  )

  const openShipCalculator = useCallback(
    (ship: ObservableShip) => {
      workspaceStore.createItem({ type: 'Ship', id: ship.id }).setActive()
    },
    [workspaceStore]
  )

  const itemSelector = useCallback(
    (item: WorkspaceItem) => {
      let result: ObservableOperation | ObservableShip | undefined
      if (item.type === 'Operation') {
        result = getOperation(item.id)
      } else {
        result = getShip(item.id)
      }
      if (!result) {
        item.remove()
      }
      return result
    },
    [getOperation, getShip]
  )
  const visiblePanel = location.pathname === '/operation'

  return { workspaceStore, openOperation, openShipCalculator, itemSelector, visiblePanel }
}

export default useWorkspace
