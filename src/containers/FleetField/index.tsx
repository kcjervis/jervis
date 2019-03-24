import { FleetRole, FleetType, nonNullable } from 'kc-calculator'
import flatMap from 'lodash/flatMap'
import range from 'lodash/range'
import React, { useContext } from 'react'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Add from '@material-ui/icons/Add'
import Remove from '@material-ui/icons/Remove'
import { Theme } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'

import StatIcon from '../../components/StatIcon'
import ShipForm from '../ShipForm'
import FleetDetail from './FleetDetail'

import ProficiencyDialog from '../../components/ProficiencyDialog'
import { ObservableFleet, ObservableOperation, OperationStoreContext } from '../../stores'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    ships: {
      display: 'flex',
      flexWrap: 'wrap',
      maxWidth: 8 * 31 * 3
    },
    bottomControl: {
      display: 'flex',
      justifyContent: 'center'
    }
  })
)

interface FleetFieldProps {
  fleet: ObservableFleet
  operation: ObservableOperation
}

const FleetField: React.FC<FleetFieldProps> = ({ fleet, operation }) => {
  const { ships } = fleet
  const operationStore = useContext(OperationStoreContext)
  const classes = useStyles()

  const addShipForm = () => {
    ships.push(undefined)
  }

  const removeShipForm = () => {
    if (ships.length > 6) {
      ships.pop()
    }
  }

  const setProficiency = (value: number) => {
    flatMap(ships, ship => ship && ship.equipments)
      .filter(nonNullable)
      .forEach(equip => {
        equip.proficiency = value
      })
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
    <div className={classes.root}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography>制空: {fleet.asKcObject.fighterPower}</Typography>
        <ProficiencyDialog changeProficiency={setProficiency} />
        {range(1, 6).map(nodeDivaricatedFactor => (
          <div key={nodeDivaricatedFactor} style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
            <StatIcon statKey="los" label={`(${nodeDivaricatedFactor})`} />
            <Typography>{getEffectiveLos(nodeDivaricatedFactor).toFixed(2)}</Typography>
          </div>
        ))}
      </div>

      <div className={classes.ships}>
        {ships.map((ship, index) => (
          <ShipForm key={index} fleet={fleet} index={index} ship={ship} onEndDrag={operationStore.switchShip} />
        ))}
      </div>

      <div className={classes.bottomControl}>
        <Button onClick={addShipForm}>
          <Add />
        </Button>
        <Button onClick={removeShipForm}>
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

export default FleetField
