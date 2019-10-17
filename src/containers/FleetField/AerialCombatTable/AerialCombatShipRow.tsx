import React from "react"
import { IShip, Side, AerialCombat } from "kc-calculator"
import { ShipAntiAir } from "kc-calculator/dist/Battle/AerialCombat"
import { observer } from "mobx-react-lite"

import calcAntiAirCutinRates from "./calcAntiAirCutinRate"

import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"

import { toPercent } from "../../../utils"

type AerialCombatShipRowProps = {
  ship: IShip
  side: Side
  fleetAntiAir: number
  combinedFleetModifier?: number
  antiAirCutin?: AerialCombat.AntiAirCutin
  adjustedAntiAirModifier: number
  fleetAntiAirModifier: number
}

const AerialCombatShipRow: React.FC<AerialCombatShipRowProps> = ({
  ship,
  side,
  fleetAntiAir,
  combinedFleetModifier = 1,
  antiAirCutin,
  adjustedAntiAirModifier,
  fleetAntiAirModifier
}) => {
  const shipAntiAir = new ShipAntiAir(ship, side, fleetAntiAir, combinedFleetModifier, antiAirCutin)
  const { adjustedAntiAir, minimumBonus, antiAirPropellantBarrageChance } = shipAntiAir
  const aaciRates = calcAntiAirCutinRates(ship)

  const proportionalShotdownRate = shipAntiAir.calcProportionalShotdownRate(adjustedAntiAirModifier)
  const fixedShotdownNumber = shipAntiAir.calcFixedShotdownNumber(adjustedAntiAirModifier, fleetAntiAirModifier)

  return (
    <TableRow>
      <Tooltip title={`連合艦隊補正${combinedFleetModifier}`}>
        <TableCell scope="row">{ship.name}</TableCell>
      </Tooltip>
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
        {antiAirPropellantBarrageChance !== 0 ? toPercent(antiAirPropellantBarrageChance) : "不可"}
      </TableCell>
    </TableRow>
  )
}

export default observer(AerialCombatShipRow)
