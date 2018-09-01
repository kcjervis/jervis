import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import FleetPage from './FleetPage'
import LandBasePage from './LandBasePage'

import { selectors } from '../redux/modules/orm'

const styles = theme => ({
  menu: {
    display: 'flex',
    alignItems: 'center'
  }
})

const OperationPage = ({ operation, location, history, classes }) => {
  if (!operation) {
    history.replace('operations')
    return null
  }
  const { activeTab = 0 } = location.state
  const { fleets } = operation
  const activeFleet = fleets[activeTab]
  return (
    <div className={classes.root}>
      <Tabs
        value={activeTab}
        onChange={(e, value) => {
          const newState = { ...location.state, activeTab: value }
          history.replace('operation', newState)
        }}
      >
        {fleets.map((fleet, index) => (
          <Tab key={`fleetTab${index}`} label={index + 1} />
        ))}
        <Tab label="基地航空隊" value="landBase" />
      </Tabs>
      {activeFleet && <FleetPage fleetId={activeFleet.id} />}
      {activeTab === 'landBase' && <LandBasePage operation={operation} />}
    </div>
  )
}

const mapStateToProps = (state, props) => ({
  operation: selectors.operationSelector(state, props)
})

const mapDispatchToProps = dispatch => ({})

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(OperationPage)
