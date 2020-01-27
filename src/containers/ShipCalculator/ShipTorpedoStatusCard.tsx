import React from "react"
import { IShip, createShipAttackCalculator } from "kc-calculator"
import clsx from "clsx"

import { makeStyles } from "@material-ui/core/styles"

import { Table } from "../../components"
import AttackPowerText from "./AttackPowerText"

const useStyles = makeStyles({
  root: {
    padding: 4
  }
})

type ShipTorpedoStatusCardProps = {
  calculator: ReturnType<typeof createShipAttackCalculator>
}

const ShipTorpedoStatusCard: React.FC<ShipTorpedoStatusCardProps> = props => {
  const classes = useStyles()
  const { calculator } = props
  if (!calculator.canDoTorpedoAttack) {
    return null
  }
  const createCellRenderer = (isCritical: boolean) => () => {
    const power = calculator.calcTorpedoPower(isCritical)
    return <AttackPowerText {...power} />
  }

  return (
    <Table
      data={[0]}
      columns={[
        { label: "最終攻撃力", getValue: createCellRenderer(false) },
        { label: "クリティカル", getValue: createCellRenderer(true) }
      ]}
    />
  )
}

export default ShipTorpedoStatusCard
