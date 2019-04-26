import React, { useState } from 'react'
import { IShip, Side, AerialCombat } from 'kc-calculator'
import {
  fleetAntiAir as calcFleetAntiAir,
  shipAdjustedAntiAir,
  fixedShotdownNumber,
  proportionalShotdownRate
} from 'kc-calculator/dist/Battle/AerialCombat/antiAir'

import calcAntiAirCutinRates from './calcAntiAirCutinRate'

import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { toPercent } from '../ContactTable'
import { maxBy } from 'lodash-es'

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
  const aaciRates = calcAntiAirCutinRates(ship)

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {ship.name}
      </TableCell>
      <TableCell align="right">{shipAdjustedAntiAir(ship, side)}</TableCell>
      <TableCell align="right">{proportionalShotdownRate(ship, side, combinedFleetModifier).toFixed(4)}</TableCell>
      <TableCell align="right">
        {fixedShotdownNumber(ship, side, fleetAntiAir, combinedFleetModifier, antiAirCutin)}
      </TableCell>
      <TableCell align="right">{antiAirCutin ? antiAirCutin.minimumBonus : 1}</TableCell>
      <TableCell align="right">
        {aaciRates.map(({ cutin, rate }) => (
          <Typography key={cutin.id}>
            {cutin.id}種 {toPercent(rate)}
          </Typography>
        ))}
      </TableCell>
    </TableRow>
  )
}

export default AerialCombatShipRow
