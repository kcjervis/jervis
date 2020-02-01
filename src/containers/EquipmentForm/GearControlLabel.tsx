import React from "react"
import clsx from "clsx"

import Box, { BoxProps } from "@material-ui/core/Box"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import BuildIcon from "@material-ui/icons/Build"

import { Flexbox, SlotSizePopover, GearControlBar } from "../../components"
import { ObservableGear } from "../../stores"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%"
    },
    slotSize: {
      color: theme.palette.grey[500],
      width: 16,
      paddingRight: 2,
      textAlign: "right",
      flexShrink: 0
    }
  })
)

type GearControlLabelProps = {
  gear: ObservableGear
  slotSize?: number
  maxSlotSize?: number
  onSlotSizeChange?: (value: number) => void
  onUpdateClick?: () => void
  equippable?: boolean
} & BoxProps

const GearControlLabel: React.FC<GearControlLabelProps> = ({
  gear,
  onUpdateClick,
  slotSize,
  maxSlotSize,
  onSlotSizeChange,
  equippable = true,
  ...boxProps
}) => {
  const classes = useStyles()
  return (
    <Flexbox className={classes.root}>
      <div className={classes.slotSize}>
        {slotSize === undefined || maxSlotSize === undefined ? (
          <BuildIcon style={{ fontSize: "0.875rem", verticalAlign: "middle" }} />
        ) : (
          onSlotSizeChange && <SlotSizePopover value={slotSize} max={maxSlotSize} onChange={onSlotSizeChange} />
        )}
      </div>

      <GearControlBar
        gear={gear.asKcObject}
        onRemove={gear.remove}
        onGearChange={onUpdateClick}
        onStarChange={gear.changeImprovement}
        onExpChange={gear.changeProficiency}
      />
    </Flexbox>
  )
}

export default GearControlLabel
