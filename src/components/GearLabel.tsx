import React from "react"
import clsx from "clsx"
import { IGear } from "kc-calculator"

import Box, { BoxProps } from "@material-ui/core/Box"
import { makeStyles, Theme } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"

import GearIcon from "./GearIcon"

const useStyles = makeStyles({
  icon: {
    height: 24,
    marginRight: 4
  },
  name: {
    fontSize: "0.75rem",
    overflow: "hidden",
    whiteSpace: "nowrap"
  }
})

type GearLabelProps = {
  gear: IGear
  slotSize?: number
  equippable?: boolean
} & BoxProps

const GearLabel: React.FC<GearLabelProps> = ({ gear, slotSize, equippable = true, ...boxProps }) => {
  const classes = useStyles()
  return (
    <Box display="flex" alignItems="center" {...boxProps}>
      <GearIcon className={classes.icon} iconId={gear.iconId} />
      <Typography className={classes.name} noWrap color={equippable ? "initial" : "secondary"}>
        {gear.name}
      </Typography>
    </Box>
  )
}

export default GearLabel
