import React from 'react'
import { DayCombatSpecialAttack, NightBattleSpecialAttack } from 'kc-calculator'

import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'
import orange from '@material-ui/core/colors/orange'
import indigo from '@material-ui/core/colors/indigo'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import LabeledValue from './LabeledValue'

const useStyles = makeStyles(
  createStyles({
    shelling: {
      color: orange[500],
      borderColor: orange[500]
    },
    nightAttack: {
      color: indigo[300],
      borderColor: indigo[300]
    }
  })
)

type AttackChipProps = {
  attack?: DayCombatSpecialAttack | NightBattleSpecialAttack
}

export default function AttackChip({ attack }: AttackChipProps) {
  const classes = useStyles()
  let className: string | undefined
  if (attack instanceof DayCombatSpecialAttack) {
    className = classes.shelling
  }
  if (attack instanceof NightBattleSpecialAttack) {
    className = classes.nightAttack
  }
  const label = attack ? attack.name : '単発'
  const chip = <Chip className={className} size="small" variant="outlined" label={label} />
  if (!attack) {
    return chip
  }
  return <Tooltip title={<LabeledValue label="攻撃力補正" value={attack.modifier.power} />}>{chip}</Tooltip>
}
