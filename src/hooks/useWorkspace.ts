import { useContext, useCallback, useMemo } from 'react'
import useReactRouter from 'use-react-router'

import { ObservableOperation, WorkspaceStoreContext, WorkspaceItem } from '../stores'

const useWorkspace = () => {
  const workspaceStore = useContext(WorkspaceStoreContext)
  const { history } = useReactRouter()

  const openOperation = useCallback(
    (operation: ObservableOperation) => {
      const item = workspaceStore.createItem({ type: 'Operation', id: operation.id })
      item.setActive()
      history.replace('operation')
    },
    [workspaceStore]
  )

  return { workspaceStore, openOperation }
}

export default useWorkspace
