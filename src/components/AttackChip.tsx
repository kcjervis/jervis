import React from "react"
import clsx from "clsx"
import { DayCombatSpecialAttack, NightCombatSpecialAttack } from "kc-calculator"

import Chip from "@material-ui/core/Chip"
import Tooltip from "@material-ui/core/Tooltip"
import orange from "@material-ui/core/colors/orange"
import indigo from "@material-ui/core/colors/indigo"
import { makeStyles } from "@material-ui/core/styles"

import LabeledValue from "./LabeledValue"

const useStyles = makeStyles({
  root: {
    minWidth: 8 * 6
  },
  shelling: {
    color: orange[500],
    borderColor: orange[500]
  },
  nightAttack: {
    color: indigo[200],
    borderColor: indigo[200]
  }
})

type AttackChipProps = {
  attack?: DayCombatSpecialAttack | NightCombatSpecialAttack
}

export default function AttackChip({ attack }: AttackChipProps) {
  const classes = useStyles()
  let className: string | undefined
  if (attack instanceof DayCombatSpecialAttack) {
    className = classes.shelling
  }
  if (attack instanceof NightCombatSpecialAttack) {
    className = classes.nightAttack
  }
  const label = attack ? attack.name : "単発"
  const chip = <Chip className={clsx(className, classes.root)} size="small" variant="outlined" label={label} />
  if (!attack) {
    return chip
  }
  const title = (
    <>
      <LabeledValue label="攻撃力補正" display="inline-block" mr={1} value={attack.modifier.power} />
      <LabeledValue label="命中補正" display="inline-block" value={attack.modifier.accuracy} />
    </>
  )
  return <Tooltip title={title}>{chip}</Tooltip>
}
