import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'
import React from 'react'
import { connect } from 'react-redux'

import Typography from '@material-ui/core/Typography'

import ShipPlate from './ShipPlate'

import { FleetModel } from '../calculator'
import { fleetSelector } from '../redux/modules/orm/selectors'
import { RootState } from '../types'

const styles: StyleRulesCallback = theme => ({})

interface IFleetPageProps extends WithStyles {
  fleet: FleetModel
}

const FleetPage: React.SFC<IFleetPageProps> = ({ fleet, classes }) => {
  const fleetId = fleet.id ? fleet.id : 0
  return (
    <div>
      <Typography>{`制空値 ${fleet.calculateFighterPower()}`}</Typography>
      {fleet.getDisplayedShips().map((ship, index) => (
        <ShipPlate key={index} fleetId={fleetId} shipId={ship && ship.id} index={index} />
      ))}
    </div>
  )
}

export default withStyles(styles)(FleetPage)
