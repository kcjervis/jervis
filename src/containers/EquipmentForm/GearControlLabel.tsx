import React from "react"
import clsx from "clsx"

import { makeStyles } from "@material-ui/core/styles"

import { Flexbox, GearControlBar } from "../../components"
import { ObservableGear } from "../../stores"

import SlotSizeButton from "./SlotSizeButton"

const slotSizeWidth = 16

const useStyles = makeStyles({
  root: {
    height: "100%"
  },
  slot: {
    width: slotSizeWidth,
    paddingRight: 2,
    textAlign: "right",
    flexShrink: 0
  },
  gear: {
    width: `calc(100% - ${slotSizeWidth}px)`
  }
})

type GearControlLabelProps = {
  gear: ObservableGear
  slotSize?: number
  maxSlotSize?: number
  onSlotSizeChange?: (value: number) => void
  onUpdateClick?: () => void
  equippable?: boolean
}

const GearControlLabel: React.FC<GearControlLabelProps> = ({
  gear,
  onUpdateClick,
  slotSize,
  maxSlotSize,
  onSlotSizeChange,
  equippable = true
}) => {
  const classes = useStyles()
  return (
    <Flexbox className={classes.root}>
      <SlotSizeButton className={classes.slot} value={slotSize} max={maxSlotSize} onChange={onSlotSizeChange} />

      <GearControlBar
        className={classes.gear}
        gear={gear.asKcObject}
        equippable={equippable}
        onRemove={gear.remove}
        onGearChange={onUpdateClick}
        onStarChange={gear.changeImprovement}
        onExpChange={gear.changeProficiency}
      />
    </Flexbox>
  )
}

export default GearControlLabel
