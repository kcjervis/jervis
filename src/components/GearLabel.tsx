import React from "react"
import clsx from "clsx"
import { IGear } from "kc-calculator"

import Box, { BoxProps } from "@material-ui/core/Box"
import { makeStyles } from "@material-ui/core/styles"

import { Text } from "./atoms"
import { GearIcon } from "./molecules"

const useStyles = makeStyles({
  icon: {
    height: 24,
    marginRight: 4
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
      <Text noWrap color={equippable ? "initial" : "secondary"}>
        {gear.name}
      </Text>
    </Box>
  )
}

export default GearLabel
