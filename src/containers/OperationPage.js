import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Restore from '@material-ui/icons/Restore'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import FleetPage from '../containers/FleetPage'

import { actions as entitiesActions } from '../redux/modules/entities'

const styles = theme => ({
  menu: {
    display: 'flex',
    alignItems: 'center'
  }
})

const OperationPage = ({ operations, location, history, classes }) => {
  if (!location.state) return '存在しません'
  const { operationsId, activeTab = 0 } = location.state
  const operation = operations.get(operationsId)
  if (!operation) return '存在しません'

  const fleets = operation.get('fleets')
  const fleetsId = fleets.get(activeTab)

  const menus = ['1', '2', '3', '4']
  return (
    <div className={classes.root}>
      <Tabs
        value={activeTab}
        onChange={(event, value) => {
          const newState = { ...location.state, activeTab: value }
          history.replace('operation', newState)
        }}
      >
        {fleets.map((fleetsId, index) => (
          <Tab key={fleetsId} label={index + 1} />
        ))}
      </Tabs>
      {fleetsId && <FleetPage fleetsId={fleetsId} />}
    </div>
  )
}

const mapStateToProps = ({ entities }) => ({
  operations: entities.get('operations')
})

const mapDispatchToProps = dispatch => ({
  entitiesActions: bindActionCreators(entitiesActions, dispatch)
})

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(OperationPage)
