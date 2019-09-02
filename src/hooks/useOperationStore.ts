import { useContext, useCallback, useMemo } from "react"

import {
  ObservableOperation,
  WorkspaceStoreContext,
  OperationStoreContext,
  TemporaryOperationStoreContext
} from "../stores"
import { nonNullable } from "kc-calculator"

const useOperationStore = () => {
  const workspaceStore = useContext(WorkspaceStoreContext)
  const persistentOperationStore = useContext(OperationStoreContext)
  const temporaryOperationStore = useContext(TemporaryOperationStoreContext)

  const baseDeps = [persistentOperationStore, temporaryOperationStore, workspaceStore]

  const { activeItem } = workspaceStore

  const activeOperation = useMemo(() => {
    if (!activeItem) {
      return undefined
    }
    const operation = persistentOperationStore.getOperation(activeItem.id)
    if (operation) {
      return operation
    }
    if (activeItem.type === "Operation") {
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

  const operations = useMemo(
    () => persistentOperationStore.operations.concat(temporaryOperationStore.operations),
    baseDeps
  )

  const ships = useMemo(
    () =>
      operations
        .flatMap(({ fleets }) => fleets)
        .flatMap(({ ships }) => ships)
        .filter(nonNullable),
    operations
  )

  const getShip = (id: string) => ships.find(ship => ship.id === id)

  return {
    persistentOperationStore,
    temporaryOperationStore,
    activeOperation,
    isTemporary,
    save,

    getOperation,
    getShip
  }
}

export default useOperationStore
