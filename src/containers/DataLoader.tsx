import React, { useContext, useEffect, useState } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'

import { loadStores, ObservableOperation, TemporaryOperationStoreContext } from '../stores'
import { getOperation } from '../stores/firebase'
import { useWorkspace } from '../hooks'

const loadOperation = async () => {
  const url = new URL(window.location.href)
  const filePath = url.searchParams.get('operation-path')
  const dataObject = url.searchParams.get('operation-json')
  url.search = ''
  window.history.replaceState('', '', url.href)
  if (filePath) {
    return await getOperation(filePath)
  } else if (dataObject) {
    return ObservableOperation.create(JSON.parse(dataObject))
  }
  return undefined
}

const DataLoader: React.FC = ({ children }) => {
  const [isReady, setIsReady] = useState(false)
  const { openOperation } = useWorkspace()
  const temporaryOperationStore = useContext(TemporaryOperationStoreContext)

  useEffect(() => {
    const load = async () => {
      await loadStores()
      const operation = await loadOperation()
      if (operation instanceof ObservableOperation) {
        temporaryOperationStore.push(operation)
        openOperation(operation)
      }
      setIsReady(true)
    }
    load()
  }, [setIsReady])

  if (!isReady) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={120} />
      </div>
    )
  }

  return <>{children}</>
}

export default DataLoader
