import { FleetRole, FleetTypeName, nonNullable } from 'kc-calculator'
import { range } from 'lodash-es'
import React from 'react'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Add from '@material-ui/icons/Add'
import Remove from '@material-ui/icons/Remove'
import Tooltip from '@material-ui/core/Tooltip'
import Box from '@material-ui/core/Box'
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'

import { StatIcon, EquipmentsSettingDialog, FlexBox } from '../../components'
import ShipForm from '../ShipForm'
import FleetDetail from './FleetDetail'

import { ObservableFleet, ObservableOperation } from '../../stores'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      justifyContent: 'center'
    },
    ships: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'space-between',
      maxWidth: 8 * 125
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
  const classes = useStyles()

  const addShipForm = () => {
    ships.push(undefined)
  }

  const removeShipForm = () => {
    if (ships.length > 6) {
      ships.pop()
    }
  }

  const fleetIndex = operation.fleets.indexOf(fleet)
  const { fleetType } = operation
  let fleetRole = FleetRole.MainFleet
  if (fleetIndex === 1 && fleetType !== FleetTypeName.Single) {
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
    <FlexBox justifyContent="center">
      <div>
        <FlexBox>
          <FlexBox flexGrow={1}>
            <Typography>制空: {fleet.asKcObject.fighterPower}</Typography>
            <Typography style={{ marginLeft: 8 }}>マップ索敵: </Typography>
            {range(1, 6).map(nodeDivaricatedFactor => (
              <Tooltip key={nodeDivaricatedFactor} title={`分岐点係数${nodeDivaricatedFactor}`}>
                <FlexBox ml={1}>
                  <StatIcon statKey="los" label={nodeDivaricatedFactor} />
                  <Typography variant="caption">{getEffectiveLos(nodeDivaricatedFactor).toFixed(2)}</Typography>
                </FlexBox>
              </Tooltip>
            ))}
          </FlexBox>
          <EquipmentsSettingDialog equipments={ships.flatMap(ship => ship && ship.equipments).filter(nonNullable)} />

          <div className={classes.bottomControl}>
            <Button title="艦娘枠を増やす" onClick={addShipForm}>
              <Add />
            </Button>
            <Button title="艦娘枠を減らす" onClick={removeShipForm}>
              <Remove />
            </Button>
          </div>
        </FlexBox>

        <Box maxWidth={8 * 125}>
          <Grid container spacing={1}>
            {ships.map((ship, index) => (
              <Grid key={index} item xs={6} style={{ minWidth: 8 * 60 }}>
                <ShipForm key={index} store={fleet} index={index} ship={ship} />
              </Grid>
            ))}
          </Grid>

          <FleetDetail
            operation={operation.asKcObject}
            fleet={fleet.asKcObject}
            fleetRole={fleetRole}
            isCombinedFleet={isCombinedFleet}
            combinedFleetPlanes={combinedFleetPlanes}
          />
        </Box>
      </div>
    </FlexBox>
  )
}

export default FleetField
