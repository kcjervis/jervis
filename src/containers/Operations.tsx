import React from 'react'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Add from '@material-ui/icons/Add'

import OperationCard from './OperationCard'

import { actions, selectors } from '../redux/modules/orm'
import { RootState } from '../types'

interface IOperationsProps {
  createOperation: (payload: { id: number; index: number }) => void
  operations: any[]
  maxId: number
}

/**
 * 編成選択ページ
 */
const Operations: React.SFC<IOperationsProps> = props => {
  const { createOperation, operations, maxId = -1 } = props
  const handleClick = () => {
    const id = maxId + 1
    createOperation({ id, index: id })
  }
  return (
    <div>
      {operations.map(({ id, index }) => (
        <div key={id}>
          <OperationCard operationId={id} index={index} />
        </div>
      ))}
      <Button onClick={handleClick}>
        <Add />
        <Typography>編成を追加</Typography>
      </Button>
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  maxId: state.orm.Operation.meta.maxId,
  operations: selectors.operationsSelector(state)
})

export default connect(
  mapStateToProps,
  { createOperation: actions.createOperation }
)(Operations)
