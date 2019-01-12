import { ArtillerySpotting, FleetRole, FleetType } from 'kc-calculator'
import range from 'lodash/range'
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

import StatIcon from '../components/StatIcon'
import ContactTable from './ContactTable'
import FleetDetail from './FleetDetail'
import ShipField from './ShipField'

import { ObservableOperation } from '../stores'
import ObservableFleet from '../stores/ObservableFleet'
import OperationStore from '../stores/OperationStore'

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
  operation: ObservableOperation
  operationStore?: OperationStore
}

const FleetField: React.SFC<IFleetFieldProps> = ({ fleet, operationStore, classes, operation }) => {
  const { ships } = fleet
  const addShipField = () => {
    ships.push(undefined)
  }
  const removeShipField = () => {
    if (ships.length > 6) {
      ships.pop()
    }
  }

  const fleetIndex = operation.fleets.indexOf(fleet)
  const { fleetType } = operation
  let fleetRole = FleetRole.MainFleet
  if (fleetIndex === 1 && fleetType !== FleetType.Single) {
    fleetRole = FleetRole.EscortFleet
  }

  // あとで連合用ページを作る
  const isCombinedFleet = operation.asKcObject.isCombinedFleetOperation && [0, 1].includes(fleetIndex)
  const mainFleet = operation.fleets[0].asKcObject
  const escortFleet = operation.fleets[1].asKcObject
  const combinedFleetPlanes = mainFleet.planes.concat(escortFleet.planes)

  const { hqLevel } = operation

  const getEffectiveLos = (factor: number) => {
    if (isCombinedFleet) {
      return mainFleet.effectiveLos(factor, hqLevel) + escortFleet.effectiveLos(factor, hqLevel)
    }
    return fleet.asKcObject.effectiveLos(factor, hqLevel)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography>制空: {fleet.asKcObject.fighterPower}</Typography>
        {range(1, 6).map(nodeDivaricatedFactor => (
          <div key={nodeDivaricatedFactor} style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
            <StatIcon statName="los" label={`(${nodeDivaricatedFactor})`} />
            <Typography>{getEffectiveLos(nodeDivaricatedFactor).toFixed(2)}</Typography>
          </div>
        ))}
      </div>

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

      <FleetDetail
        fleet={fleet.asKcObject}
        fleetRole={fleetRole}
        isCombinedFleet={isCombinedFleet}
        combinedFleetPlanes={combinedFleetPlanes}
      />
    </div>
  )
}

const Injected = inject('operationStore')(FleetField)

export default withRouter(withStyles(styles)(Injected))
