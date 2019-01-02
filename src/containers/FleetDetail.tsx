import { AirControlState, ArtillerySpotting, FleetRole, IFleet, IShip } from 'kc-calculator'
import sum from 'lodash/sum'
import React from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
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
  const baseValue = ArtillerySpotting.calculateArtillerySpottingBaseValue(
    ship,
    fleetLosModifier,
    airControlState,
    isFlagship
  )

  const artillerySpottings = ArtillerySpotting.getPossibleArtillerySpottings(ship)
  const artillerySpottingMap = new Map<ArtillerySpotting, string>()
  let totalRate = 0
  artillerySpottings.reduce((prevRate, currentAp) => {
    const currentRate = (baseValue / currentAp.typeFactor) * (1 - prevRate)
    totalRate += currentRate
    artillerySpottingMap.set(currentAp, (currentRate * 100).toFixed(1))
    return currentRate
  }, 0)

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {ship.name}
      </TableCell>
      <TableCell align="right">{baseValue}</TableCell>
      <TableCell align="right">{(totalRate * 100).toFixed(1)}</TableCell>
      <TableCell align="right">{artillerySpottingMap.get(ArtillerySpotting.DoubleAttack)}</TableCell>
      <TableCell align="right">{artillerySpottingMap.get(ArtillerySpotting.MainMaim)}</TableCell>
      <TableCell align="right">{artillerySpottingMap.get(ArtillerySpotting.MainAp)}</TableCell>
      <TableCell align="right">{artillerySpottingMap.get(ArtillerySpotting.MainRader)}</TableCell>
      <TableCell align="right">{artillerySpottingMap.get(ArtillerySpotting.MainSec)}</TableCell>
    </TableRow>
  )
}

interface IFleetDetailProps {
  fleet: IFleet
  fleetRole: FleetRole
}

interface IFleetDetailState {
  isAirSupremacy: boolean
}

class FleetDetail extends React.Component<IFleetDetailProps, IFleetDetailState> {
  public state = { isAirSupremacy: true }

  public changeAirState = () => this.setState(state => ({ isAirSupremacy: !state.isAirSupremacy }))

  public render() {
    const { fleet, fleetRole } = this.props
    const fleetLosModifier = ArtillerySpotting.calculateFleetLosModifier(fleet)
    const airControlState = this.state.isAirSupremacy ? AirControlState.AirSupremacy : AirControlState.AirSuperiority
    return (
      <div>
        <Typography>艦隊索敵補正: {fleetLosModifier}</Typography>
        <FormControlLabel
          control={<Switch onChange={this.changeAirState} checked={this.state.isAirSupremacy} />}
          label={airControlState.name}
        />

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

export default FleetDetail
