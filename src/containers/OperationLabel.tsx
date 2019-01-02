import React from 'react'

import Button from '@material-ui/core/Button'

import { ObservableOperation } from '../stores'

interface IOperationLabelProps {
  moveOperationPage: (operation: ObservableOperation) => void
  operation: ObservableOperation
  index: number
}

const OperationLabel: React.SFC<IOperationLabelProps> = ({ moveOperationPage, operation, index }) => {
  const handleClick = () => {
    moveOperationPage(operation)
  }
  return (
    <div>
      <Button onClick={handleClick} size="large">
        編成{index + 1}
      </Button>
    </div>
  )
}

export default OperationLabel
