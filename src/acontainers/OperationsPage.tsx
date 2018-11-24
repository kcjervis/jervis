import { List } from 'immutable'
import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import Button from '@material-ui/core/Button'

import OperationLabel from './OperationLabel'

import { Side } from 'kc-calculator'
import { actions } from '../redux/modules/operations'
import { RootState } from '../types'

interface IOperationsPageProps {
  operationIds: List<string>
  generateOperation: () => void
}

const OperationsPage: React.SFC<IOperationsPageProps> = ({ operationIds, generateOperation }) => {
  return (
    <div>
      {operationIds.map(id => (
        <OperationLabel key={id} operationId={id} />
      ))}
      <Button onClick={generateOperation}>編成追加</Button>
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  operationIds: state.operations.map(({ id }) => id)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  generateOperation: () => actions.generateOperation(dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OperationsPage)
