import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import FleetPage from './FleetPage'

import { OperationRecord } from '../redux/modules/operations'
import * as selectors from '../redux/modules/selectors'
import { RootState } from '../types'

import { IOperation } from 'kc-calculator'

const styles = (theme: Theme) =>
  createStyles({
    menu: {
      display: 'flex',
      alignItems: 'center'
    }
  })

interface IOperationPageProps extends WithStyles<typeof styles>, RouteComponentProps<{}> {
  operationRecord?: OperationRecord
  operation?: IOperation
}

const OperationPage: React.SFC<IOperationPageProps> = ({ operation, operationRecord, location, history, classes }) => {
  if (!operation || !operationRecord) {
    history.replace('operations')
    return null
  }
  const { activeTab = 0 } = location.state
  const { fleets } = operationRecord
  const activeFleetId = fleets.get(activeTab)
  const handleChange = (e: unknown, value: number) => {
    const newState = { ...location.state, activeTab: value }
    history.replace('operation', newState)
  }
  return (
    <div>
      <Tabs value={activeTab} onChange={handleChange}>
        {fleets.map((fleet, index) => (
          <Tab key={`fleetTab${index}`} label={index + 1} />
        ))}
      </Tabs>
      {activeFleetId && <FleetPage fleetId={activeFleetId} />}
    </div>
  )
}

interface IOperationPageConnectedProps extends RouteComponentProps<{}> {}

const mapStateToProps = (state: RootState, props: IOperationPageConnectedProps) => {
  const locationState = props.location.state
  const operationId = locationState && locationState.operationId
  return {
    operation: selectors.operationSelector(state, { operationId }),
    operationRecord: state.operations.find(({ id }) => id === operationId)
  }
}

const WithStyles = withStyles(styles)(OperationPage)
export default connect(
  mapStateToProps,
  null
)(WithStyles)
