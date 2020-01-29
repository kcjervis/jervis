import React from "react"
import { Damage } from "kc-calculator"

import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"
import { makeStyles, createStyles } from "@material-ui/core/styles"

import { toPercent } from "../../utils"
import { LabeledValue } from "../../components"

export const damageToText = ({ min, max, scratchDamageProbability, isDeadly }: Damage) => {
  if (max === 0) {
    return "確定割合"
  }
  const minText = min === 0 ? `(割合${toPercent(scratchDamageProbability)})` : min
  return `${minText} - ${max}${isDeadly ? "(確殺)" : ""}`
}

const useStyles = makeStyles(
  createStyles({
    root: {
      width: 8 * 60
    }
  })
)

type HitRateTextProps = {
  hitRate: number
  criticalRate?: number
  accuracyValue: number
  evasionValue: number
}

const HitRateText: React.FC<HitRateTextProps> = ({ hitRate, criticalRate, accuracyValue, evasionValue }) => {
  const factors: Array<{ label: string; value: number }> = [
    { label: "攻撃側命中項", value: accuracyValue },
    { label: "防御側回避項", value: evasionValue }
  ]
  const hitStatus = factors.map((factor, index) => <LabeledValue key={index} {...factor} />)

  const criticalText = criticalRate ? `(${toPercent(criticalRate, 0)})` : ""

  return (
    <Tooltip enterDelay={500} title={hitStatus}>
      <Typography variant="inherit">
        {toPercent(hitRate, 0)}
        {criticalText}
      </Typography>
    </Tooltip>
  )
}

export default HitRateText
