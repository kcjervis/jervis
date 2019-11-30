import React, { useState } from "react"
import { IShip, AswAttackStatus } from "kc-calculator"
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

type ShipAswStatusCardProps = {
  ship: IShip
  formationModifier: number
  engagementModifier: number
  a11: number
}

const ShipAswStatusCard: React.FC<ShipAswStatusCardProps> = props => {
  const classes = useStyles()
  const { ship, formationModifier, engagementModifier, a11 } = props
  const aswStatus = new AswAttackStatus(ship, false)
  if (aswStatus.type === "None") {
    return null
  }
  const createAswCellRenderer = (isCritical: boolean) => () => {
    const power = aswStatus.createPower({
      formationModifier,
      engagementModifier,
      isCritical,
      isOpeningAaw: false,
      optionalModifiers: { a11 }
    })
    return <Typography variant="inherit">{round(power.postcap, 4)}</Typography>
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
