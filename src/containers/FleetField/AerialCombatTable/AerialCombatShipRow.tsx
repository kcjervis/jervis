import React, { useState } from 'react'
import { IShip, Side, AerialCombat } from 'kc-calculator'
import {
  fleetAntiAir as calcFleetAntiAir,
  shipAdjustedAntiAir,
  fixedShotdownNumber,
  proportionalShotdownRate
} from 'kc-calculator/dist/Battle/AerialCombat/antiAir'

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
  const antiAirCutins = AerialCombat.AntiAirCutin.getPossibleAntiAirCutins(ship)
  const cutinRates = new Array<{ ci: AerialCombat.AntiAirCutin; rate: number }>()

  const isSpecialAaci = (aaci: AerialCombat.AntiAirCutin) => [34, 35].includes(aaci.id)
  const specialAntiAirCutins = antiAirCutins.filter(isSpecialAaci)
  const totalSpecialAaciRate = specialAntiAirCutins.reduce((prevRate, aaci) => {
    const rate = ((1 - prevRate) * aaci.probability) / 101
    cutinRates.push({ ci: aaci, rate })
    return rate
  }, 0)

  const normalAntiAirCutins = antiAirCutins.filter(aaci => !isSpecialAaci(aaci))
  const totalNormalAaciRate = normalAntiAirCutins.reduce((prevRate, aaci) => {
    const rate = aaci.probability / 101
    let curRate = rate - prevRate
    if (curRate < 0) {
      cutinRates.push({ ci: aaci, rate: 0 })
      return prevRate
    }
    if (totalSpecialAaciRate > 0) {
      curRate = (1 - totalSpecialAaciRate) * curRate
    }
    cutinRates.push({ ci: aaci, rate: curRate })
    return rate
  }, 0)

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
        {cutinRates.map(({ ci, rate }) => (
          <Typography key={ci.id}>
            {ci.id}種 {toPercent(rate)}
          </Typography>
        ))}
      </TableCell>
    </TableRow>
  )
}

export default AerialCombatShipRow
