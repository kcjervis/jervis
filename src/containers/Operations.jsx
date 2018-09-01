import React from 'react'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/Add'
import Typography from '@material-ui/core/Typography'

import OperationCard from './OperationCard'

import { actions, selectors } from '../redux/modules/orm'

const Operations = props => {
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

const mapStateToProps = state => ({
  maxId: state.orm.Operation.meta.maxId,
  operations: selectors.operationsSelector(state)
})

const mapDispatchToProps = dispatch => ({
  createOperation(payload) {
    dispatch(actions.createOperation(payload))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Operations)
