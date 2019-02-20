import React from 'react'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import { RemoveButton } from '../components/IconButtons'
import ShipImage from '../components/ShipImage'
import { ObservableOperation } from '../stores'

interface IOperationLabelProps {
  moveOperationPage: (operation: ObservableOperation) => void
  operation: ObservableOperation
  index: number
}

const OperationLabel: React.FC<IOperationLabelProps> = ({ moveOperationPage, operation, index }) => {
  const handleClick = () => {
    moveOperationPage(operation)
  }
  const flagship = operation.fleets[0].ships[0]
  return (
    <Card style={{ margin: 8 }}>
      <CardContent>
        <Button onClick={handleClick} size="large" variant="outlined">
          {flagship && <ShipImage imageType="banner" masterId={flagship.masterId} />}
          <Typography style={{ margin: 8 }}>{operation.name}</Typography>
        </Button>
        <RemoveButton onClick={operation.remove} />
      </CardContent>
    </Card>
  )
}

export default OperationLabel
