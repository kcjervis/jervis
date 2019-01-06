import React from 'react'

import Button from '@material-ui/core/Button'

import { RemoveButton } from '../components/IconButtons'

import ShipImage from '../components/ShipImage'
import { ObservableOperation } from '../stores'

interface IOperationLabelProps {
  moveOperationPage: (operation: ObservableOperation) => void
  operation: ObservableOperation
  index: number
}

const OperationLabel: React.SFC<IOperationLabelProps> = ({ moveOperationPage, operation, index }) => {
  console.log(operation)
  const handleClick = () => {
    moveOperationPage(operation)
  }
  const flagship = operation.fleets[0].ships[0]
  return (
    <div>
      <Button onClick={handleClick} size="large" variant="outlined">
        {flagship && <ShipImage imageType="banner" masterId={flagship.masterId} />}
        編成{index + 1}
      </Button>
      <RemoveButton onClick={operation.remove} />
    </div>
  )
}

export default OperationLabel
