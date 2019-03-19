import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import useReactRouter from 'use-react-router'

import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/Add'

import NishikumaFormDialog from './NishikumaFormDialog'
import OperationLabel, { OperationLabelProps } from './OperationLabel'

import { OperationStoreContext } from '../stores'

const OperationsPage: React.FC = props => {
  const { history } = useReactRouter()
  const operationStore = useContext(OperationStoreContext)
  const handleDrag = (props1: OperationLabelProps, props2: OperationLabelProps) => {
    operationStore.operations[props2.index] = props1.operation
    operationStore.operations[props1.index] = props2.operation
  }
  const handleCreate = () => {
    const newOperation = operationStore.createOperation()
    operationStore.setActiveOperation(newOperation)
    history.push('operation')
  }
  return (
    <div style={{ margin: 8 }}>
      {operationStore.operations.map((operation, index) => (
        <OperationLabel key={index} index={index} operation={operation} onEndDrag={handleDrag} />
      ))}

      <div style={{ display: 'flex', margin: 8 }}>
        <Button onClick={handleCreate} variant="outlined">
          <Add />
          編成を追加
        </Button>
        <NishikumaFormDialog operationStore={operationStore} />
      </div>
    </div>
  )
}

export default observer(OperationsPage)
