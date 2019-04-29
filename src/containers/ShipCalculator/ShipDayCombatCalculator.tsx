import React from 'react'
import { IShip, DayCombat, Formation } from 'kc-calculator'

import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import DamageCalculator from './DamageCalculator'

interface ShipDayCombatCalculatorProps {
  ship: IShip
  formation: Formation
}

const ShipDayCombatCalculator: React.FC<ShipDayCombatCalculatorProps> = ({ ship, formation }) => {
  const power = DayCombat.Shelling.calcPower(ship, formation.shellingPowerModifier)
  const accuracy = DayCombat.Shelling.calcAccuracy(ship, formation.shellingAccuracyModifier)

  return (
    <>
      <Table style={{ width: 8 * 15 }}>
        <TableBody>
          <TableRow>
            <TableCell>攻撃力</TableCell>
            <TableCell>{power}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>命中項</TableCell>
            <TableCell>{accuracy}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>回避項</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <DamageCalculator attackPower={power} defensePower={100} />
    </>
  )
}

export default ShipDayCombatCalculator
