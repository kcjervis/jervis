import { observer } from 'mobx-react-lite'
import React from 'react'

import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import { Damage } from 'kc-calculator'

type DamageCalculatorProps = {
  attackPower: number
  defensePower: number
  remainingAmmoModifier?: number
}

const DamageCalculator: React.FC<DamageCalculatorProps> = ({ attackPower, defensePower, remainingAmmoModifier }) => {
  const [min, max] = Damage.calcDamageRange(attackPower, defensePower, remainingAmmoModifier)
  return (
    <Table style={{ width: 8 * 20 }}>
      <TableBody>
        <TableRow>
          <TableCell>ダメージ</TableCell>
          <TableCell>
            {min}~{max}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default DamageCalculator
