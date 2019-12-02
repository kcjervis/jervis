import React, { useState } from "react"
import { IShip, TorpedoAttackStatus } from "kc-calculator"
import { round } from "lodash-es"
import clsx from "clsx"

import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

import { Table } from "../../components"

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
  a11: number
}

const ShipTorpedoStatusCard: React.FC<ShipTorpedoStatusCardProps> = props => {
  const classes = useStyles()
  const { ship, fleetFactor, formationModifier, engagementModifier, a11 } = props
  if (ship.nakedStats.torpedo === 0) {
    return null
  }
  const status = new TorpedoAttackStatus(ship)
  const createCellRenderer = (isCritical: boolean) => () => {
    const power = status.createPower({
      fleetFactor,
      formationModifier,
      engagementModifier,
      isCritical,
      optionalModifiers: { a11 }
    })
    return <Typography variant="inherit">{round(power.postcap, 4)}</Typography>
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