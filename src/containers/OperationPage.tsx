import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { compose } from 'redux'

import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import FleetPage from './FleetPage'
import LandBasePage from './LandBasePage'

import { selectors } from '../redux/modules/orm'

import { OperationModel } from '../calculator'
import { RootState } from '../types'

const styles: StyleRulesCallback = theme => ({
  menu: {
    display: 'flex',
    alignItems: 'center'
  }
})

interface IOperationPageProps extends WithStyles, RouteComponentProps<{}> {
  operation?: OperationModel
}

const OperationPage: React.SFC<IOperationPageProps> = ({ operation, location, history, classes }) => {
  if (!operation) {
    history.replace('operations')
    return null
  }
  const { activeTab = 0 } = location.state
  const { fleets, landBase } = operation
  const activeFleet = fleets[activeTab]
  const handleChange = (e: unknown, value: number) => {
    const newState = { ...location.state, activeTab: value }
    history.replace('operation', newState)
  }
  return (
    <div className={classes.root}>
      <Tabs value={activeTab} onChange={handleChange}>
        {fleets.map((fleet, index) => (
          <Tab key={`fleetTab${index}`} label={index + 1} />
        ))}
        {landBase.length > 0 && <Tab label="基地航空隊" value="landBase" />}
      </Tabs>
      {activeFleet && <FleetPage fleet={activeFleet} />}
      {activeTab === 'landBase' && <LandBasePage landBase={landBase} />}
    </div>
  )
}

interface IOperationPageConnectedProps extends RouteComponentProps<{}> {}

const mapStateToProps = (state: RootState, props: IOperationPageConnectedProps) => {
  const locationState = props.location.state
  const operationId = locationState && locationState.operationId
  return {
    operation: selectors.operationSelector(state, { operationId })
  }
}

const WithStyles = withStyles(styles)(OperationPage)
export default connect(
  mapStateToProps,
  null
)(WithStyles)
