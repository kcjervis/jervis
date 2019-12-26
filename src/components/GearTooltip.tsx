import React from "react"
import { IGear, gearStatKeys } from "kc-calculator"
import clsx from "clsx"

import Box from "@material-ui/core/Box"
import { makeStyles, Theme } from "@material-ui/core/styles"

import StatLabel from "./StatLabel"
import GearLabel from "./GearLabel"
import { Flexbox, Text, Tooltip } from "./atoms"

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
          <Text>id: {gear.masterId}</Text>
          {statElements}
        </Box>
      }
      {...rest}
    />
  )
}

export default GearTooltip
