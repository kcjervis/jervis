import { inject, observer } from 'mobx-react'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Add from '@material-ui/icons/Add'
import Remove from '@material-ui/icons/Remove'

import ObservableFleet from '../stores/ObservableFleet'
import OperationStore from '../stores/OperationStore'
import ShipField from './ShipField'

const styles = createStyles({
  ships: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  bottomControl: {
    display: 'flex',
    justifyContent: 'center'
  }
})

interface IFleetFieldProps extends WithStyles<typeof styles>, RouteComponentProps {
  fleet: ObservableFleet
  operationStore?: OperationStore
}

const FleetField: React.SFC<IFleetFieldProps> = ({ fleet, operationStore, classes, history }) => {
  const { ships } = fleet
  const addShipField = () => {
    ships.push(undefined)
  }
  const removeShipField = () => {
    if (ships.length > 6) {
      ships.pop()
    }
  }
  return (
    <div>
      <Typography>制空: {fleet.asKcObject.fighterPower}</Typography>
      <div className={classes.ships}>
        {ships.map((ship, index) => (
          <ShipField key={index} fleetId={fleet.id} index={index} ship={ship} onEndDrag={operationStore!.switchShip} />
        ))}
      </div>

      <div className={classes.bottomControl}>
        <Button onClick={addShipField}>
          <Add />
        </Button>
        <Button onClick={removeShipField}>
          <Remove />
        </Button>
      </div>
    </div>
  )
}

const Injected = inject('operationStore')(FleetField)

export default withRouter(withStyles(styles)(Injected))
