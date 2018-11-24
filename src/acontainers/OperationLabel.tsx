import { List } from 'immutable'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import Button from '@material-ui/core/Button'

import { IOperation } from 'kc-calculator'
import { actions } from '../redux/modules/operations'
import { RootState } from '../types'

interface IOperationLabelProps extends RouteComponentProps {
  operationId: string
}

const OperationLabel: React.SFC<IOperationLabelProps> = ({ operationId, history }) => {
  const handleClick = () => history.push('./operation', { operationId })
  return (
    <div>
      <Button onClick={handleClick}>{operationId}</Button>
    </div>
  )
}

export default withRouter(OperationLabel)
