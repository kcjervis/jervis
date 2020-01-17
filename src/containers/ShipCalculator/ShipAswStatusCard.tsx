import React from "react"
import { IShip, ShipAswCalculator, AttackPowerModifierRecord } from "kc-calculator"
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
  ship: IShip
  formationModifier: number
  engagementModifier: number
  optionalModifiers: AttackPowerModifierRecord
}

const ShipAswStatusCard: React.FC<ShipAswStatusCardProps> = props => {
  const classes = useStyles()
  const { ship, formationModifier, engagementModifier, optionalModifiers } = props
  const calculator = ShipAswCalculator.fromShip(ship, "Day")

  if (calculator.type === "None") {
    return null
  }

  const createAswCellRenderer = (isCritical: boolean) => () => {
    const power = calculator.calcPower({
      formationModifier,
      engagementModifier,
      isCritical,
      optionalModifiers
    })

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
