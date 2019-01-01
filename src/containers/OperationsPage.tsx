import { inject, observer } from 'mobx-react'
import React from 'react'

import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/Add'

import OperationLabel from './OperationLabel'

import OperationStore from '../stores/OperationStore'

interface IOperationsPageProps {
  operationStore?: OperationStore
}

const OperationsPage: React.SFC<IOperationsPageProps> = props => {
  const operationStore = props.operationStore!
  return (
    <div style={{ margin: 8 }}>
      {operationStore.operations.map((operation, index) => (
        <OperationLabel key={index} index={index} operation={operation} />
      ))}

      <Button onClick={operationStore.createOperation}>
        <Add />
        編成を追加
      </Button>
    </div>
  )
}

export default inject('operationStore')(observer(OperationsPage))
