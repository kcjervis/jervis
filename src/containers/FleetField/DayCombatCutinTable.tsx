import { AirControlState, DayCombat, FleetRole, IFleet, IShip } from 'kc-calculator'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import React from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import { toPercent } from '../../utils'

const { ArtillerySpotting, AircraftCarrierCutin } = DayCombat

type DayCombatCutin = DayCombat.ArtillerySpotting | DayCombat.AircraftCarrierCutin

const dayCutins = new Array<DayCombatCutin>().concat(ArtillerySpotting.all, AircraftCarrierCutin.all)

const CutinRate: React.FC<{ cutin: DayCombatCutin; rate?: number }> = ({ cutin, rate }) => {
  if (!rate) {
    return null
  }
  return (
    <Typography noWrap={true}>
      {`${cutin.name}(×${cutin.powerModifier})`}: {toPercent(rate)}
    </Typography>
  )
}

interface ShipRowProps {
  ship?: IShip
  fleetLosModifier: number
  isFlagship: boolean
}

const useCutinState = (
  ship: IShip,
  fleetLosModifier: number,
  isFlagship: boolean,
  airControlState: AirControlState
) => {
  const baseValue = ArtillerySpotting.calculateArtillerySpottingBaseValue(
    ship,
    fleetLosModifier,
    airControlState,
    isFlagship
  )

  const dayCombatCutins = [
    ...ArtillerySpotting.getPossibleArtillerySpottings(ship),
    ...AircraftCarrierCutin.getPossibleAircraftCarrierCutins(ship)
  ]

  const dayCombatCutinMap = new Map<DayCombatCutin, number>()

  const cutinRate = dayCombatCutins.reduce((acc, curCutin) => {
    let currentRate = (1 - acc) * (baseValue / curCutin.typeFactor)
    if (currentRate > 1) {
      currentRate = 1
    }
    dayCombatCutinMap.set(curCutin, currentRate)
    return acc + currentRate
  }, 0)

  return {
    baseValue,
    dayCombatCutinMap,
    cutinRate
  }
}

const ShipRow: React.FC<ShipRowProps> = ({ ship, fleetLosModifier, isFlagship }) => {
  if (!ship) {
    return null
  }
  const airSupremacyCutinState = useCutinState(ship, fleetLosModifier, isFlagship, AirControlState.AirSupremacy)
  const airSuperiorityCutinState = useCutinState(ship, fleetLosModifier, isFlagship, AirControlState.AirSuperiority)

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {ship.name}
      </TableCell>
      <TableCell align="right">{airSupremacyCutinState.baseValue}</TableCell>
      <TableCell align="right">{toPercent(airSupremacyCutinState.cutinRate)}</TableCell>
      <TableCell align="right">
        {dayCutins.map(cutin => (
          <CutinRate key={cutin.name} cutin={cutin} rate={airSupremacyCutinState.dayCombatCutinMap.get(cutin)} />
        ))}
      </TableCell>
      <TableCell align="right">{airSuperiorityCutinState.baseValue}</TableCell>
      <TableCell align="right">{toPercent(airSuperiorityCutinState.cutinRate)}</TableCell>
      <TableCell align="right">
        {dayCutins.map(cutin => (
          <CutinRate key={cutin.name} cutin={cutin} rate={airSuperiorityCutinState.dayCombatCutinMap.get(cutin)} />
        ))}
      </TableCell>
    </TableRow>
  )
}

const ObservedShipRow = observer(ShipRow)

interface DayCombatCutinTableProps {
  fleet: IFleet
  fleetRole: FleetRole
}

class AirControlStateStore {
  @observable
  public airControlState: AirControlState = AirControlState.AirSupremacy

  @action
  public setAirControlState = (airState: AirControlState) => {
    this.airControlState = airState
  }
}

const DayCombatCutinTable: React.FC<DayCombatCutinTableProps> = props => {
  const { fleet, fleetRole } = props

  const fleetLosModifier = ArtillerySpotting.calculateFleetLosModifier(fleet)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography>艦隊索敵補正: {fleetLosModifier}</Typography>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>艦娘</TableCell>
            <TableCell align="right">観測項(確保)</TableCell>
            <TableCell align="right">合計発動率(確保)</TableCell>
            <TableCell align="right">発動率(確保)</TableCell>
            <TableCell align="right">観測項(優勢)</TableCell>
            <TableCell align="right">合計発動率(優勢)</TableCell>
            <TableCell align="right">発動率(優勢)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fleet.ships.map((ship, index) => (
            <ObservedShipRow
              key={index}
              ship={ship}
              fleetLosModifier={fleetLosModifier}
              isFlagship={fleetRole === FleetRole.MainFleet && index === 0}
            />
          ))}
        </TableBody>
      </Table>

      <div />
    </div>
  )
}

export default observer(DayCombatCutinTable)
