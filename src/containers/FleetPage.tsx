import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'

import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/Add'

import ShipPlate from './ShipPlate'

import { fleetSelector } from '../redux/modules/orm/selectors'
import { RootState } from '../types'

const styles: StyleRulesCallback = theme => ({
  addShipButton: {
    margin: theme.spacing.unit,
    minHeight: 80
  }
})

interface IFleetPageProps extends WithStyles, RouteComponentProps<{}> {
  fleet: { id: number; ships: any[] }
}

const FleetPage: React.SFC<IFleetPageProps> = ({ fleet, classes, history }) => {
  const fleetId = fleet.id
  const handleAddShip = (index: number) => () => {
    history.push('/ships', { fleetId, index })
  }
  return (
    <div>
      {fleet.ships.map((ship, index) => {
        if (ship) {
          return <ShipPlate key={index} fleetId={fleetId} shipId={ship && ship.id} index={index} />
        }
        return (
          <Button
            key={index}
            className={classes.addShipButton}
            variant="outlined"
            fullWidth={true}
            size="large"
            onClick={handleAddShip(index)}
          >
            <Add />
            艦娘
          </Button>
        )
      })}
    </div>
  )
}

interface IFleetPageConnectedProps {
  fleetId: number
}

const mapStateToProps = (state: RootState, props: IFleetPageConnectedProps) => ({
  fleet: fleetSelector(state, props)
})

const WithRouter = withRouter(FleetPage)
const WithStyles = withStyles(styles)(WithRouter)
export default connect(
  mapStateToProps,
  null
)(WithStyles)
