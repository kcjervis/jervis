import React, { useContext, useState } from 'react'
import useReactRouter from 'use-react-router'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import { CopyButton, RemoveButton } from '../components/IconButtons'
import ShipImage from '../components/ShipImage'
import OperationShareDialog from './OperationShareDialog'

import withDragAndDrop from '../hocs/withDragAndDrop'
import { ObservableOperation, OperationStoreContext } from '../stores'
import { setOperation } from '../stores/firebase'

export interface IOperationLabelProps {
  operation: ObservableOperation
  index: number
}

const OperationLabel: React.FC<IOperationLabelProps> = ({ operation }) => {
  const store = useContext(OperationStoreContext)
  const { history } = useReactRouter()
  const handleOpen = () => {
    store.setActiveOperation(operation)
    history.push('operation')
  }
  const handleCopy = () => {
    store.copyOperation(operation)
  }

  const flagship = operation.fleets[0].ships[0]
  return (
    <Card style={{ margin: 8 }}>
      <Typography variant="caption">{operation.name}</Typography>
      <Button onClick={handleOpen} size="large" variant="outlined">
        {flagship ? <ShipImage imageType="banner" masterId={flagship.masterId} /> : '編成を開く'}
      </Button>
      <RemoveButton onClick={operation.remove} />
      <CopyButton title="編成をコピー" onClick={handleCopy} />

      <OperationShareDialog operation={operation} />
    </Card>
  )
}

export default withDragAndDrop('OperationLabel')(OperationLabel)
