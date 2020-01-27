import React from "react"
import { createShipAttackCalculator } from "kc-calculator"
import clsx from "clsx"

import { makeStyles } from "@material-ui/core/styles"

import { Table } from "../../components"
import AttackPowerText from "./AttackPowerText"

const useStyles = makeStyles({
  root: {
    padding: 4
  }
})

type ShipAswStatusCardProps = {
  calculator: ReturnType<typeof createShipAttackCalculator>
}

const ShipAswStatusCard: React.FC<ShipAswStatusCardProps> = props => {
  const classes = useStyles()
  const { calculator } = props

  if (!calculator.canDoAsw) {
    return null
  }

  const createAswCellRenderer = (isCritical: boolean) => () => {
    const power = calculator.calcAswPower(isCritical)
    return <AttackPowerText {...power} />
  }

  return (
    <Table
      data={[0]}
      columns={[
        { label: "最終攻撃力", getValue: createAswCellRenderer(false) },
        { label: "クリティカル", getValue: createAswCellRenderer(true) }
      ]}
    />
  )
}

export default ShipAswStatusCard
