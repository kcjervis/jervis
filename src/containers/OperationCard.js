import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'

import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import DeleteButton from '../components/DeleteButton'

import withDragSortable from '../hocs/withDragSortable'

import { actions as entitiesActions } from '../redux/modules/entities'
import { routerActions } from 'react-router-redux'

const OperationCard = props => {
  const { uniqueId, index, removeOperation, routerActions } = props
  const operationsId = uniqueId
  return (
    <Card
      style={{
        display: 'flex',
        alignItems: 'center',
        width: 500
      }}
      onClick={() => routerActions.push('./operation', { operationsId })}
    >
      <Typography>new</Typography>
      <DeleteButton onClick={() => removeOperation(index)} />
    </Card>
  )
}

const mapStateToProps = ({ entities }, { uniqueId }) => ({
  operation: entities.getIn(['operations', uniqueId])
})

const mapDispatchToProps = dispatch => ({
  removeOperation(payload) {
    dispatch(entitiesActions.removeOperation(payload))
  },
  onSortEnd(payload) {
    dispatch(entitiesActions.sortOperationIndex(payload))
  },
  routerActions: bindActionCreators(routerActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDragSortable(OperationCard))
