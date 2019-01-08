import { AirControlState, AircraftCarrierCutin, FleetRole, IFleet, IShip } from 'kc-calculator'
import { observer } from 'mobx-react'
import React from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

interface IShipRowProps {
  ship?: IShip
  fleetLosModifier: number
  airControlState: AirControlState
  isFlagship: boolean
}

const ShipRow: React.SFC<IShipRowProps> = ({ ship, fleetLosModifier, airControlState, isFlagship }) => {
  if (!ship) {
    return null
  }
  const baseValue = AircraftCarrierCutin.calculateAircraftCarrierCutinBaseValue(
    ship,
    fleetLosModifier,
    airControlState,
    isFlagship
  )

  const AircraftCarrierCutins = AircraftCarrierCutin.getPossibleAircraftCarrierCutins(ship)
  const AircraftCarrierCutinMap = new Map<AircraftCarrierCutin, string>()

  const totalRate = AircraftCarrierCutins.reduce((prevRate, currentAp) => {
    let currentRate = (1 - prevRate) * (baseValue / currentAp.typeFactor)
    if (currentRate > 1) {
      currentRate = 1
    }
    AircraftCarrierCutinMap.set(currentAp, (currentRate * 100).toFixed(1))
    return prevRate + currentRate
  }, 0)

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {ship.name}
      </TableCell>
      <TableCell align="right">{baseValue}</TableCell>
      <TableCell align="right">{(totalRate * 100).toFixed(1)}</TableCell>
      <TableCell align="right">{AircraftCarrierCutinMap.get(AircraftCarrierCutin.FighterBomberAttacker)}</TableCell>
      <TableCell align="right">{AircraftCarrierCutinMap.get(AircraftCarrierCutin.BomberBomberAttacker)}</TableCell>
      <TableCell align="right">{AircraftCarrierCutinMap.get(AircraftCarrierCutin.BomberAttacker)}</TableCell>
    </TableRow>
  )
}

interface IFleetAircraftCarrierCutinTableProps {
  fleet: IFleet
  fleetRole: FleetRole
  airControlState: AirControlState
  fleetLosModifier: number
}

@observer
export default class FleetAircraftCarrierCutinTable extends React.Component<IFleetAircraftCarrierCutinTableProps> {
  public render() {
    const { fleet, fleetRole, airControlState, fleetLosModifier } = this.props
    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>艦娘</TableCell>
              <TableCell align="right">観測項</TableCell>
              <TableCell align="right">合計発動率 (%)</TableCell>
              <TableCell align="right">FBA (%)</TableCell>
              <TableCell align="right">BBA (%)</TableCell>
              <TableCell align="right">BA (%)</TableCell>
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
              />
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}
