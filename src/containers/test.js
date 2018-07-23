import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { routerActions } from 'react-router-redux'
import Paper from '@material-ui/core/Paper'

import OperationCard from './OperationCard'
import BackButton from '../components/BackButton'

import { actions } from '../redux/modules/test'
import { actions as entitiesActions } from '../redux/modules/entities'

const Test = props => {
  const { operationIds } = props
  return (
    <Paper>
      <BackButton />
      {operationIds.map((id, index) => (
        <OperationCard
          key={id}
          uniqueId={id}
          index={index}
          operationIds={operationIds}
        />
      ))}
    </Paper>
  )
}

const mapStateToProps = state => ({
  test: state.test,
  operationIds: state.entities.get('operationIds')
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  routerActions: bindActionCreators(routerActions, dispatch),
  entitiesActions: bindActionCreators(entitiesActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Test)
