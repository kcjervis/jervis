import React, { useContext } from 'react'
import useReactRouter from 'use-react-router'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import { RemoveButton } from '../components/IconButtons'
import ShipImage from '../components/ShipImage'
import withDragAndDrop from '../hocs/withDragAndDrop'
import { ObservableOperation, OperationStoreContext } from '../stores'

export interface IOperationLabelProps {
  operation: ObservableOperation
  index: number
}

const OperationLabel: React.FC<IOperationLabelProps> = ({ operation }) => {
  const store = useContext(OperationStoreContext)
  const { history } = useReactRouter()
  const handleClick = () => {
    store.setActiveOperation(operation)
    history.push('operation')
  }
  const flagship = operation.fleets[0].ships[0]
  return (
    <Card style={{ margin: 8 }}>
      <Typography variant="caption">{operation.name}</Typography>
      <Button onClick={handleClick} size="large" variant="outlined">
        {flagship ? <ShipImage imageType="banner" masterId={flagship.masterId} /> : '編成を開く'}
      </Button>
      <RemoveButton onClick={operation.remove} />
    </Card>
  )
}

export default withDragAndDrop('OperationLabel')(OperationLabel)
