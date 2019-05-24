import React, { useState } from 'react'
import { IShip, Side, AerialCombat } from 'kc-calculator'
import {
  fleetAntiAir as calcFleetAntiAir,
  shipAdjustedAntiAir as calcShipAdjustedAntiAir,
  fixedShotdownNumber,
  proportionalShotdownRate
} from 'kc-calculator/dist/Battle/AerialCombat/antiAir'
import { observer } from 'mobx-react-lite'

import calcAntiAirCutinRates from './calcAntiAirCutinRate'

import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import { toPercent } from '../../../utils'

const calcAntiAirPropellantBarrageChance = (ship: IShip, adjustedAntiAir: number) => {
  const count = ship.countEquipment(274)
  if (!count) {
    return 0
  }
  const equipmentBonus = 40 + 30 * count
  const shipClassBonus = ship.shipClass.is('IseClass') ? 70 : 0
  const numerator = 400 - (48 + equipmentBonus + shipClassBonus)
  return (adjustedAntiAir + 0.9 * ship.stats.luck) / numerator
}

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
  const adjustedAntiAir = calcShipAdjustedAntiAir(ship, side)
  const propellantBarrageChance = calcAntiAirPropellantBarrageChance(ship, adjustedAntiAir)
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {ship.name}
      </TableCell>
      <TableCell align="right">{adjustedAntiAir}</TableCell>
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
      <TableCell align="right">{toPercent(propellantBarrageChance)}</TableCell>
    </TableRow>
  )
}

export default observer(AerialCombatShipRow)
