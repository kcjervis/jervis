import { inject, observer } from 'mobx-react'
import React from 'react'
import { RouteComponentProps } from 'react-router'

import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/Add'

import NishikumaFormDialog from './NishikumaFormDialog'
import OperationLabel from './OperationLabel'

import { ObservableOperation, OperationStore } from '../stores'

interface IOperationsPageProps extends RouteComponentProps {
  operationStore?: OperationStore
}

const OperationsPage: React.SFC<IOperationsPageProps> = props => {
  const operationStore = props.operationStore!
  const moveOperationPage = (operation: ObservableOperation) => {
    operationStore.visibleOperation = operation
    props.history.push('operation')
  }
  return (
    <div style={{ margin: 8 }}>
      {operationStore.operations.map((operation, index) => (
        <OperationLabel key={index} index={index} operation={operation} moveOperationPage={moveOperationPage} />
      ))}

      <div style={{ display: 'flex', margin: 8 }}>
        <Button onClick={operationStore.createOperation} variant="outlined">
          <Add />
          編成を追加
        </Button>
        <NishikumaFormDialog operationStore={operationStore} />
      </div>
    </div>
  )
}

export default inject('operationStore')(observer(OperationsPage))
