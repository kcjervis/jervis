import { GearStatKey, ShipStatKey, Speed } from "kc-calculator"
import React from "react"
import clsx from "clsx"

import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"
import { makeStyles, Theme } from "@material-ui/core/styles"

import StatIcon from "./StatIcon"

import statKeys from "../data/statKeys"

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center"
  }
})

interface StatLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  statKey: ShipStatKey | GearStatKey
  stat: number
  increased?: number
  bonus?: number
  disableTooltip?: boolean
  visibleStatName?: boolean
}

const rangeValueToName = (range: number) => {
  switch (range) {
    case 0:
      return "無"
    case 1:
      return "短"
    case 2:
      return "中"
    case 3:
      return "長"
  }
  if (range >= 4) {
    return "超長"
  }
  return "不明"
}

const valueToString = (value: number | undefined) => {
  if (!value) {
    return ""
  }
  return value > 0 ? `+${value}` : `${value}`
}

const StatLabel: React.FC<StatLabelProps> = props => {
  const classes = useStyles()
  const { statKey, stat, increased, bonus, disableTooltip, visibleStatName, className, ...rest } = props

  const statData = statKeys.find(statData => statData.key === statKey)
  const statName = statData && statData.name

  let displayValue: number | string = stat
  let visibleBonus = Boolean(increased || bonus)
  if (statKey === "speed") {
    const speed = Speed.fromNumber(stat)
    displayValue = `${speed.name}(${stat})`
    visibleBonus = false
  } else if (statKey === "range") {
    displayValue = `${rangeValueToName(stat)}(${stat})`
    visibleBonus = false
  }

  const label = (
    <div className={clsx(classes.root, className)} {...rest}>
      <StatIcon statKey={statKey} label={visibleStatName ? statName : undefined} />
      <Typography variant="subtitle2" style={{ lineHeight: undefined }}>
        {displayValue}
      </Typography>
      {visibleBonus && (
        <>
          <Typography variant="caption">(</Typography>
          <Typography variant="caption" color="primary">
            {valueToString(increased)}
          </Typography>
          <Typography variant="caption" color="secondary">
            {valueToString(bonus)}
          </Typography>
          <Typography variant="caption">)</Typography>
        </>
      )}
    </div>
  )

  if (disableTooltip) {
    return label
  }

  return <Tooltip title={statName}>{label}</Tooltip>
}

export default StatLabel
