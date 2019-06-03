import React from 'react'
import { IShip, Side, AerialCombat } from 'kc-calculator'
import { ShipAntiAir } from 'kc-calculator/dist/Battle/AerialCombat'
import { observer } from 'mobx-react-lite'

import calcAntiAirCutinRates from './calcAntiAirCutinRate'

import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import { toPercent } from '../../../utils'

type AerialCombatShipRowProps = {
  ship: IShip
  side: Side
  fleetAntiAir: number
  combinedFleetModifier?: number
  antiAirCutin?: AerialCombat.AntiAirCutin
}

const AerialCombatShipRow: React.FC<AerialCombatShipRowProps> = ({
  ship,
  side,
  fleetAntiAir,
  combinedFleetModifier,
  antiAirCutin
}) => {
  const shipAntiAir = new ShipAntiAir(ship, side, fleetAntiAir, combinedFleetModifier, antiAirCutin)
  const {
    adjustedAntiAir,
    proportionalShotdownRate,
    fixedShotdownNumber,
    minimumBonus,
    antiAirPropellantBarrageChance
  } = shipAntiAir
  const aaciRates = calcAntiAirCutinRates(ship)

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {ship.name}
      </TableCell>
      <TableCell align="right">{adjustedAntiAir}</TableCell>
      <TableCell align="right">{proportionalShotdownRate.toFixed(4)}</TableCell>
      <TableCell align="right">{fixedShotdownNumber}</TableCell>
      <TableCell align="right">{minimumBonus}</TableCell>
      <TableCell align="right">
        {aaciRates.map(({ cutin, rate }) => (
          <Typography key={cutin.id}>
            {cutin.id}種 {toPercent(rate)}
          </Typography>
        ))}
      </TableCell>
      <TableCell align="right">
        {antiAirPropellantBarrageChance !== 0 ? toPercent(antiAirPropellantBarrageChance) : '不可'}
      </TableCell>
    </TableRow>
  )
}

export default observer(AerialCombatShipRow)
