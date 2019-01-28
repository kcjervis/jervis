import { AirControlState, AircraftCarrierCutin, ArtillerySpotting, FleetRole, IFleet, IShip } from 'kc-calculator'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { createContext, useCallback, useContext, useState } from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import { toPercent } from './ContactTable'

type DayCombatCutin = ArtillerySpotting | AircraftCarrierCutin

const CutinTableCell: React.FC<{ cutin: DayCombatCutin; rate?: number }> = ({ cutin, rate }) => (
  <TableCell align="right">{rate && toPercent(rate)}</TableCell>
)

interface IShipRowProps {
  ship?: IShip
  fleetLosModifier: number
  airControlState: AirControlState
  isFlagship: boolean

  visibleCutins: DayCombatCutin[]
}

let ShipRow: React.FC<IShipRowProps> = ({ ship, fleetLosModifier, airControlState, isFlagship, visibleCutins }) => {
  if (!ship) {
    return null
  }
  const baseValue = ArtillerySpotting.calculateArtillerySpottingBaseValue(
    ship,
    fleetLosModifier,
    airControlState,
    isFlagship
  )

  const dayCombatCutins = new Array<DayCombatCutin>()
  dayCombatCutins.push(
    ...ArtillerySpotting.getPossibleArtillerySpottings(ship),
    ...AircraftCarrierCutin.getPossibleAircraftCarrierCutins(ship)
  )

  const dayCombatCutinMap = new Map<DayCombatCutin, number>()

  const cutinRate = dayCombatCutins.reduce((acc, curCutin) => {
    let currentRate = (1 - acc) * (baseValue / curCutin.typeFactor)
    if (currentRate > 1) {
      currentRate = 1
    }
    dayCombatCutinMap.set(curCutin, currentRate)
    return acc + currentRate
  }, 0)

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {ship.name}
      </TableCell>
      <TableCell align="right">{baseValue}</TableCell>
      <TableCell align="right">{toPercent(cutinRate)}</TableCell>
      {visibleCutins.map(cutin => (
        <CutinTableCell key={cutin.name} cutin={cutin} rate={dayCombatCutinMap.get(cutin)} />
      ))}
    </TableRow>
  )
}

ShipRow = observer(ShipRow)

const styles = createStyles({
  checkBoxForm: {
    margin: 8
  },
  checkBox: {
    padding: 0
  }
})

interface IDayCombatCutinTableProps extends WithStyles<typeof styles> {
  fleet: IFleet
  fleetRole: FleetRole
}

const dayCutins = new Array<DayCombatCutin>().concat(ArtillerySpotting.all, AircraftCarrierCutin.all)

class AirControlStateStore {
  @observable
  public airControlState: AirControlState = AirControlState.AirSupremacy

  @action
  public setAirControlState = (airState: AirControlState) => {
    this.airControlState = airState
  }
}

const AirControlStateContext = createContext(new AirControlStateStore())

const DayCombatCutinTable: React.FC<IDayCombatCutinTableProps> = props => {
  const { fleet, fleetRole, classes } = props

  const { airControlState, setAirControlState } = useContext(AirControlStateContext)
  const isAirSupremacy = airControlState === AirControlState.AirSupremacy
  const handleToggleAirState = useCallback(() => {
    if (isAirSupremacy) {
      setAirControlState(AirControlState.AirSuperiority)
    } else {
      setAirControlState(AirControlState.AirSupremacy)
    }
  }, [isAirSupremacy])

  const fleetLosModifier = ArtillerySpotting.calculateFleetLosModifier(fleet)
  const [visibleCutinSet, setVisibleCutinSet] = useState(
    new Set([
      ArtillerySpotting.DoubleAttack,
      ArtillerySpotting.MainMain,
      AircraftCarrierCutin.FighterBomberAttacker,
      AircraftCarrierCutin.BomberBomberAttacker,
      AircraftCarrierCutin.BomberAttacker
    ])
  )

  const handleToggleCutin = (cutin: DayCombatCutin) => () => {
    if (visibleCutinSet.has(cutin)) {
      visibleCutinSet.delete(cutin)
    } else {
      visibleCutinSet.add(cutin)
    }
    setVisibleCutinSet(visibleCutinSet)
  }

  const visibleCutins = dayCutins.filter(cutin => visibleCutinSet.has(cutin))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography>艦隊索敵補正: {fleetLosModifier}</Typography>
        <FormControlLabel
          style={{ marginLeft: 8 }}
          control={<Switch onChange={handleToggleAirState} checked={isAirSupremacy} color="primary" />}
          label={airControlState.name}
        />
        {dayCutins.map(cutin => (
          <FormControlLabel
            key={cutin.name}
            className={classes.checkBoxForm}
            label={<Typography variant="caption">{cutin.name}</Typography>}
            control={
              <Checkbox
                className={classes.checkBox}
                checked={visibleCutinSet.has(cutin)}
                onChange={handleToggleCutin(cutin)}
                color="primary"
              />
            }
          />
        ))}
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>艦娘</TableCell>
            <TableCell align="right">観測項</TableCell>
            <TableCell align="right">合計発動率</TableCell>
            {visibleCutins.map(({ name, powerModifier }) => (
              <TableCell key={name} align="right">
                {name}
                {`(×${powerModifier})`}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {fleet.ships.map((ship, index) => (
            <ShipRow
              key={index}
              ship={ship}
              fleetLosModifier={fleetLosModifier}
              airControlState={airControlState}
              isFlagship={fleetRole === FleetRole.MainFleet && index === 0}
              visibleCutins={visibleCutins}
            />
          ))}
        </TableBody>
      </Table>

      <div />
    </div>
  )
}

export default withStyles(styles)(observer(DayCombatCutinTable))
