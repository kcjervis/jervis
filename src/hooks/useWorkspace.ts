import { useContext, useCallback, useMemo } from 'react'
import useReactRouter from 'use-react-router'

import { ObservableOperation, WorkspaceStoreContext, WorkspaceItem, ObservableShip } from '../stores'
import useOperationStore from './useOperationStore'

const useWorkspace = () => {
  const workspaceStore = useContext(WorkspaceStoreContext)
  const { getOperation, getShip } = useOperationStore()
  const { history } = useReactRouter()

  const openOperation = useCallback(
    (operation: ObservableOperation) => {
      const item = workspaceStore.createItem({ type: 'Operation', id: operation.id })
      item.setActive()
      history.push('operation')
    },
    [workspaceStore]
  )

  const openShipCalculator = useCallback(
    (ship: ObservableShip) => {
      const item = workspaceStore.createItem({ type: 'Ship', id: ship.id })
      item.setActive()
    },
    [workspaceStore]
  )

  const itemSelector = (item: WorkspaceItem) => {
    if (item.type === 'Operation') {
      return getOperation(item.id)
    }
    return getShip(item.id)
  }

  return { workspaceStore, openOperation, openShipCalculator, itemSelector }
}

export default useWorkspace
