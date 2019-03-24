import { useContext, useCallback, useMemo } from 'react'
import useReactRouter from 'use-react-router'

import {
  ObservableOperation,
  WorkspaceStoreContext,
  OperationStoreContext,
  TemporaryOperationStoreContext
} from '../stores'

const useOperationStore = () => {
  const workspaceStore = useContext(WorkspaceStoreContext)
  const persistentOperationStore = useContext(OperationStoreContext)
  const temporaryOperationStore = useContext(TemporaryOperationStoreContext)
  const { history } = useReactRouter()

  const { activeItem } = useContext(WorkspaceStoreContext)

  const baseDeps = [persistentOperationStore, temporaryOperationStore, workspaceStore]
  const activeOperation = useMemo(() => {
    if (!activeItem) {
      return undefined
    }
    const operation = persistentOperationStore.getOperation(activeItem.id)
    if (operation) {
      return operation
    }
    if (activeItem.type === 'Operation') {
      return temporaryOperationStore.getOperation(activeItem.id)
    }

    return undefined
  }, [...baseDeps, activeItem])

  const isTemporary = useCallback((operation: ObservableOperation) => {
    return operation.store === temporaryOperationStore
  }, baseDeps)

  const save = useCallback((operation: ObservableOperation) => {
    if (isTemporary(operation)) {
      operation.remove()
      persistentOperationStore.push(operation)
    }
  }, baseDeps)

  const getOperation = (id: string) => {
    const operation = persistentOperationStore.getOperation(id)
    if (operation) {
      return operation
    }
    return temporaryOperationStore.getOperation(id)
  }

  return {
    persistentOperationStore,
    temporaryOperationStore,
    activeOperation,
    isTemporary,
    save,

    getOperation
  }
}

export default useOperationStore
