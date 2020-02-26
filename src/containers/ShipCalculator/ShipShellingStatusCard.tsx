import React from "react"
import { observer } from "mobx-react"
import { createShipAttackCalculator, DayCombatSpecialAttack } from "kc-calculator"
import clsx from "clsx"

import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

import { toPercent } from "../../utils"
import { Table, AttackChip } from "../../components"
import AttackPowerText from "./AttackPowerText"

const useStyles = makeStyles({
  root: {
    padding: 4
  },
  topText: { marginRight: 8 }
})

const getAttackName = (attack?: DayCombatSpecialAttack) => <AttackChip attack={attack} />

type ShipStatusCardProps = {
  calculator: ReturnType<typeof createShipAttackCalculator>
  specialAttackRate: ReturnType<typeof DayCombatSpecialAttack.calcRate>
}

const ShipShellingStatusCard: React.FC<ShipStatusCardProps> = props => {
  const classes = useStyles()
  const { calculator, specialAttackRate } = props

  const createShellingCellRenderer = (isCritical: boolean) => (specialAttack?: DayCombatSpecialAttack) => {
    const power = calculator.calcShellingPower(isCritical, specialAttack)
    return <AttackPowerText {...power} />
  }

  const createShellingSupportRenderer = (isCritical: boolean) => () => {
    const power = calculator.calcShellingSupportPower(isCritical)
    return <AttackPowerText {...power} />
  }

  return (
    <Box mt={1}>
      <Table
        data={specialAttackRate.dayCombatAttacks}
        columns={[
          { label: "攻撃種別", getValue: getAttackName, align: "left" },
          { label: "発動率", getValue: attack => toPercent(specialAttackRate.getAttackRate(attack)) },
          { label: "最終攻撃力", getValue: createShellingCellRenderer(false) },
          { label: "クリティカル", getValue: createShellingCellRenderer(true) }
        ]}
      />
      <Typography variant="body2">合計特殊攻撃率 {toPercent(specialAttackRate.total)}</Typography>
      <Typography variant="subtitle2" style={{ marginTop: 16 }}>
        砲撃支援
      </Typography>
      <Table
        data={[0]}
        columns={[
          { label: "最終攻撃力", getValue: createShellingSupportRenderer(false) },
          { label: "クリティカル", getValue: createShellingSupportRenderer(true) }
        ]}
      />
    </Box>
  )
}

export default observer(ShipShellingStatusCard)
