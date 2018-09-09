import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'
import React from 'react'
import { connect } from 'react-redux'

import ShipPlate from './ShipPlate'

import { fleetSelector } from '../redux/modules/orm/selectors'
import { RootState } from '../types'

const styles: StyleRulesCallback = theme => ({})

interface IFleetPageProps extends WithStyles {
  fleet: { id: number; ships: any[] }
}

const FleetPage: React.SFC<IFleetPageProps> = ({ fleet, classes }) => {
  const fleetId = fleet.id

  return (
    <div>
      {fleet.ships.map((ship, index) => (
        <ShipPlate key={index} fleetId={fleetId} shipId={ship && ship.id} index={index} />
      ))}
    </div>
  )
}

interface IFleetPageConnectedProps {
  fleetId: number
}

const mapStateToProps = (state: RootState, props: IFleetPageConnectedProps) => ({
  fleet: fleetSelector(state, props)
})

const WithStyles = withStyles(styles)(FleetPage)
export default connect(
  mapStateToProps,
  null
)(WithStyles)
