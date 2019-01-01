import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import Button from '@material-ui/core/Button'

import { ObservableOperation } from '../stores'

interface IOperationLabelProps extends RouteComponentProps {
  operation: ObservableOperation
  index: number
}

const OperationLabel: React.SFC<IOperationLabelProps> = ({ operation, index, history }) => {
  const handleClick = () => history.push('./operation', { operationId: operation.id })
  return (
    <div>
      <Button onClick={handleClick} size="large">
        編成{index + 1}
      </Button>
    </div>
  )
}

export default withRouter(OperationLabel)
