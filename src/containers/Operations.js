import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'

import AddButton from '../components/AddButton'
import OperationCard from './OperationCard'

import { actions as entitiesActions } from '../redux/modules/entities'

const Operations = props => {
  const { operationIds, entitiesActions } = props
  return (
    <div>
      {operationIds.map((id, index) => (
        <div key={id}>
          <OperationCard uniqueId={id} index={index} list={operationIds} />
        </div>
      ))}
      <AddButton onClick={() => entitiesActions.createOperation()} />
    </div>
  )
}

const mapStateToProps = state => ({
  operationIds: state.entities.get('operationIds')
})

const mapDispatchToProps = dispatch => ({
  entitiesActions: bindActionCreators(entitiesActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Operations)
