import React from "react"
import { observer } from "mobx-react"
import { createShipAttackCalculator, NightCombatSpecialAttack, IShip } from "kc-calculator"
import clsx from "clsx"

import { makeStyles } from "@material-ui/core/styles"

import { Table, AttackChip } from "../../components"
import AttackPowerText from "./AttackPowerText"

const useStyles = makeStyles({
  root: {
    padding: 4
  },
  topText: { marginRight: 8 }
})

const getAttackName = (attack?: NightCombatSpecialAttack) => <AttackChip attack={attack} />

type ShipNightAttackStatusProps = {
  calculator: ReturnType<typeof createShipAttackCalculator>
  ship: IShip
}

const ShipNightAttackStatus: React.FC<ShipNightAttackStatusProps> = props => {
  const classes = useStyles()
  const { calculator, ship } = props

  const nightAttacks = new Array<NightCombatSpecialAttack | undefined>(undefined).concat(
    NightCombatSpecialAttack.getPossibleAttacks(ship)
  )

  const createNightCellRenderer = (isCritical: boolean) => (specialAttack: NightCombatSpecialAttack | undefined) => {
    const power = calculator.calcNightPower(isCritical, specialAttack)
    return <AttackPowerText {...power} />
  }

  return (
    <Table
      data={nightAttacks}
      columns={[
        { label: "攻撃種別", getValue: getAttackName, align: "left" },
        { label: "最終攻撃力", getValue: createNightCellRenderer(false) },
        { label: "クリティカル", getValue: createNightCellRenderer(true) }
      ]}
    />
  )
}

export default observer(ShipNightAttackStatus)
