import React from "react"
import { IGear } from "kc-calculator"
import clsx from "clsx"

import Paper from "@material-ui/core/Paper"
import Popover from "@material-ui/core/Popover"
import { makeStyles, Theme } from "@material-ui/core/styles"
import BuildIcon from "@material-ui/icons/Build"

import { GearCard, GearLabel, ImprovementSelect, ProficiencySelect, SlotSizePopover } from "../../components"

import { useBaseStyles, useAnchorEl } from "../../hooks"

const useStyles = makeStyles((theme: Theme) => ({
  proficiency: {
    marginRight: 4
  },
  rightButtons: {
    display: "flex",
    alignItems: "center",
    margin: `0 4px`
  }
}))

type GearFieldCardProps = {
  gear: IGear
  slotSize?: number
  maxSlotSize?: number
  equippable?: boolean
  onImprovementChange?: (value: number) => void
  onProficiencyChange?: (value: number) => void
  onSlotSizeChange?: (value: number) => void
  onRemove?: () => void
  onUpdate?: () => void
} & React.HTMLAttributes<HTMLDivElement>

const GearFieldCard: React.FC<GearFieldCardProps> = ({
  gear,
  slotSize,
  maxSlotSize,
  equippable = true,
  onImprovementChange,
  onProficiencyChange,
  onSlotSizeChange,
  onRemove,
  onUpdate,

  className,
  ...paperProps
}) => {
  const { improvement, proficiency, category } = gear
  const { anchorEl, onClick, onClose } = useAnchorEl()
  const classes = useStyles()
  const baseClasses = useBaseStyles()

  return (
    <Paper className={clsx(baseClasses.flexbox, className)} elevation={1} {...paperProps}>
      <div style={{ width: 16, textAlign: "right" }}>
        {slotSize === undefined || maxSlotSize === undefined ? (
          <BuildIcon color="action" style={{ fontSize: "0.875rem", verticalAlign: "middle" }} />
        ) : (
          onSlotSizeChange && <SlotSizePopover value={slotSize} max={maxSlotSize} onChange={onSlotSizeChange} />
        )}
      </div>

      <GearLabel
        className={baseClasses.brightButton}
        flexGrow={1}
        gear={gear}
        equippable={equippable}
        onClick={onClick}
      />

      <div className={classes.rightButtons}>
        {category.isAerialCombatAircraft && onProficiencyChange && (
          <div className={classes.proficiency}>
            <ProficiencySelect internal={proficiency.internal} onChange={onProficiencyChange} />
          </div>
        )}
        <div>
          {onImprovementChange && <ImprovementSelect value={improvement.value} onChange={onImprovementChange} />}
        </div>
      </div>

      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}>
        <GearCard gear={gear} onRemove={onRemove} onUpdate={onUpdate} onClose={onClose} />
      </Popover>
    </Paper>
  )
}

export default GearFieldCard
