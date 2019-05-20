import React from 'react'
import { IShip, DayCombat, Formation, Engagement, AirControlState } from 'kc-calculator'
import { round } from 'lodash-es'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import DamageCalculator from './DamageCalculator'
import { toPercent } from '../../utils'
import { Select } from '../../components'
import { useSelect } from '../../hooks'

const { Shelling, SpecialAttack } = DayCombat
type SpecialAttack = DayCombat.SpecialAttack
Engagement.values.sort((engage1, engage2) => engage2.modifier - engage1.modifier)

export const useShipShellingCalculator = (
  ship: IShip,
  formationModifier: number,
  fleetLosModifier: number,
  airControlState: AirControlState,
  isFlagship: boolean
) => {
  const getAttackPower = (engagement: Engagement, criticalModifier = 1, specialAttack?: SpecialAttack) => {
    const power = Shelling.calcPower(
      ship,
      formationModifier,
      engagement.modifier,
      criticalModifier,
      specialAttack && specialAttack.powerModifier
    )
    return round(power, 4)
  }

  const specialAttackRate = SpecialAttack.calcRate(ship, fleetLosModifier, airControlState, isFlagship)

  return { getAttackPower, specialAttackRate }
}

interface ShipShellingCalculatorProps {
  getAttackPower: (engagement: Engagement, criticalModifier?: number, specialAttack?: SpecialAttack) => number
  specialAttackRate: ReturnType<typeof SpecialAttack.calcRate>
}

const ShipShellingCalculator: React.FC<ShipShellingCalculatorProps> = ({ getAttackPower, specialAttackRate }) => {
  const options = new Array<SpecialAttack | undefined>(undefined).concat(specialAttackRate.attacks)
  const specialAttackSelect = useSelect(options)

  return (
    <Paper style={{ marginLeft: 8, width: 8 * 50, padding: 8 }}>
      <Box display="flex" alignItems="center">
        <Typography>砲撃戦</Typography>
        <Select
          style={{ minWidth: 80, marginLeft: 8 }}
          {...specialAttackSelect}
          getOptionLabel={option => (option ? option.name : '単発')}
        />
      </Box>

      <Typography>攻撃力</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>交戦形態</TableCell>
            <TableCell align="right">最終攻撃力</TableCell>
            <TableCell align="right">クリティカル</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Engagement.values.map(engagement => (
            <TableRow key={engagement.id}>
              <TableCell>{engagement.name}</TableCell>
              <TableCell align="right">{getAttackPower(engagement, 1, specialAttackSelect.value)}</TableCell>
              <TableCell align="right">{getAttackPower(engagement, 1.5, specialAttackSelect.value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography>特殊攻撃</Typography>
      <Table>
        <TableBody>
          {Array.from(specialAttackRate.rateMap).map(([specialAttack, rate]) => (
            <TableRow key={specialAttack.id}>
              <TableCell>{specialAttack.name}</TableCell>
              <TableCell align="right">{toPercent(rate)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>合計</TableCell>
            <TableCell align="right">{toPercent(specialAttackRate.total)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}

export default ShipShellingCalculator
