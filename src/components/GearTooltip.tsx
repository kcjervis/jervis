import { makeStyles, Theme } from "@material-ui/core/styles"
import React from "react"
import { IGear, gearStatKeys } from "kc-calculator"
import clsx from "clsx"

import Box from "@material-ui/core/Box"

import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"

import StatLabel from "./StatLabel"
import GearLabel from "./GearLabel"
import { Flexbox } from "./atoms"

type GearTooltipProps = {
  gear: IGear
  children: React.ReactElement
}

const GearTooltip: React.FC<GearTooltipProps> = ({ gear, ...rest }) => {
  const stats = gearStatKeys.map(key => [key, gear[key]] as const).filter(([key, stat]) => stat !== 0)
  const statElements = stats.map(([key, stat]) => (
    <Flexbox key={key}>
      <StatLabel statKey={key} stat={stat} visibleStatName />
    </Flexbox>
  ))

  return (
    <Tooltip
      enterDelay={300}
      title={
        <Box>
          <GearLabel gear={gear} />
          <Typography>id: {gear.masterId}</Typography>
          {statElements}
        </Box>
      }
      {...rest}
    />
  )
}

export default GearTooltip
