import React from "react"
import { IShip, ShipTorpedoAttackCalculator, AttackPowerModifierRecord } from "kc-calculator"
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
  ship: IShip
  fleetFactor: number
  formationModifier: number
  engagementModifier: number
  optionalModifiers: AttackPowerModifierRecord
}

const ShipTorpedoStatusCard: React.FC<ShipTorpedoStatusCardProps> = props => {
  const classes = useStyles()
  const { ship, fleetFactor, formationModifier, engagementModifier, optionalModifiers } = props
  if (ship.nakedStats.torpedo === 0) {
    return null
  }
  const calculator = ShipTorpedoAttackCalculator.fromShip(ship)
  const createCellRenderer = (isCritical: boolean) => () => {
    const power = calculator.calcPower({
      fleetFactor,
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
        { label: "最終攻撃力", getValue: createCellRenderer(false) },
        { label: "クリティカル", getValue: createCellRenderer(true) }
      ]}
    />
  )
}

export default ShipTorpedoStatusCard
