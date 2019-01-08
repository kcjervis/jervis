import { AirControlState, ArtillerySpotting, FleetRole, IFleet, IShip } from 'kc-calculator'
import { observer } from 'mobx-react'
import React from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

interface IShipRowProps {
  ship?: IShip
  fleetLosModifier: number
  airControlState: AirControlState
  isFlagship: boolean
}

let ShipRow: React.SFC<IShipRowProps> = ({ ship, fleetLosModifier, airControlState, isFlagship }) => {
  if (!ship) {
    return null
  }
  const baseValue = ArtillerySpotting.calculateArtillerySpottingBaseValue(
    ship,
    fleetLosModifier,
    airControlState,
    isFlagship
  )

  const artillerySpottings = ArtillerySpotting.getPossibleArtillerySpottings(ship)
  const artillerySpottingMap = new Map<ArtillerySpotting, string>()

  const totalRate = artillerySpottings.reduce((prevRate, currentAp) => {
    let currentRate = (1 - prevRate) * (baseValue / currentAp.typeFactor)
    if (currentRate > 1) {
      currentRate = 1
    }
    artillerySpottingMap.set(currentAp, (currentRate * 100).toFixed(1))
    return prevRate + currentRate
  }, 0)

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {ship.name}
      </TableCell>
      <TableCell align="right">{baseValue}</TableCell>
      <TableCell align="right">{(totalRate * 100).toFixed(1)}</TableCell>
      <TableCell align="right">{artillerySpottingMap.get(ArtillerySpotting.DoubleAttack)}</TableCell>
      <TableCell align="right">{artillerySpottingMap.get(ArtillerySpotting.MainMain)}</TableCell>
      <TableCell align="right">{artillerySpottingMap.get(ArtillerySpotting.MainApShell)}</TableCell>
      <TableCell align="right">{artillerySpottingMap.get(ArtillerySpotting.MainRader)}</TableCell>
      <TableCell align="right">{artillerySpottingMap.get(ArtillerySpotting.MainSecond)}</TableCell>
    </TableRow>
  )
}

ShipRow = observer(ShipRow)

interface IFleetArtillerySpottingTableProps {
  fleet: IFleet
  fleetRole: FleetRole
  airControlState: AirControlState
  fleetLosModifier: number
}

@observer
class FleetArtillerySpottingTable extends React.Component<IFleetArtillerySpottingTableProps> {
  public render() {
    const { fleet, fleetRole, airControlState, fleetLosModifier } = this.props
    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>艦娘</TableCell>
              <TableCell align="right">観測項</TableCell>
              <TableCell align="right">合計弾着率 (%)</TableCell>
              <TableCell align="right">連撃 (%)</TableCell>
              <TableCell align="right">主主 (%)</TableCell>
              <TableCell align="right">主徹 (%)</TableCell>
              <TableCell align="right">主電 (%)</TableCell>
              <TableCell align="right">主副 (%)</TableCell>
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

export default FleetArtillerySpottingTable
