import React, { useState } from 'react'
import clsx from 'clsx'

import Box, { BoxProps } from '@material-ui/core/Box'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import BuildIcon from '@material-ui/icons/Build'

import {
  EquipmentIcon,
  Flexbox,
  SlotSizePopover,
  EquipmentLabel,
  ProficiencySelect,
  ImprovementSelect,
  UpdateButton,
  ClearButton,
  GearTooltip
} from '../../components'
import { ObservableEquipment } from '../../stores'
import { useHover } from '../../hooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      justifyContent: 'space-between',
      '&:hover': {
        background: 'rgba(200, 200, 200, 0.1)'
      }
    },
    slotSize: {
      color: theme.palette.grey[500],
      width: 16,
      paddingRight: 2,
      textAlign: 'right',
      flexShrink: 0
    },
    proficiency: {
      marginRight: 4
    },
    icon: {
      height: 24,
      marginRight: 4
    },
    name: {
      fontSize: '0.75rem',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }
  })
)

type GearControlLabelProps = {
  gear: ObservableEquipment
  slotSize?: number
  maxSlotSize?: number
  onSlotSizeChange?: (value: number) => void
  onUpdateClick?: () => void
  equipable?: boolean
} & BoxProps

const GearControlLabel: React.FC<GearControlLabelProps> = ({
  gear,
  onUpdateClick,
  slotSize,
  maxSlotSize,
  onSlotSizeChange,
  equipable = true,
  ...boxProps
}) => {
  const classes = useStyles()
  const [isHovered, hoverRef] = useHover()
  const visibleProficiency = gear.asKcObject.category.isAerialCombatAircraft
  return (
    <Flexbox className={classes.root}>
      <div className={classes.slotSize}>
        {slotSize === undefined || maxSlotSize === undefined ? (
          <BuildIcon style={{ fontSize: '0.875rem', verticalAlign: 'middle' }} />
        ) : (
          onSlotSizeChange && <SlotSizePopover value={slotSize} max={maxSlotSize} onChange={onSlotSizeChange} />
        )}
      </div>

      <Flexbox ref={hoverRef} height="100%" width={`calc(100% - ${visibleProficiency ? 64 : 40}px)`}>
        <GearTooltip item={gear.asKcObject}>
          <EquipmentIcon className={classes.icon} iconId={gear.asKcObject.iconId} />
        </GearTooltip>
        <div style={{ display: isHovered ? undefined : 'none' }}>
          <UpdateButton title="変更" tooltipProps={{ placement: 'top' }} size="small" onClick={onUpdateClick} />
          <ClearButton title="削除" tooltipProps={{ placement: 'top' }} size="small" onClick={gear.remove} />
        </div>
        <Typography
          className={classes.name}
          style={{ display: isHovered ? 'none' : undefined }}
          color={equipable ? 'initial' : 'secondary'}
        >
          {gear.asKcObject.name}
        </Typography>
      </Flexbox>

      <Flexbox>
        {visibleProficiency && (
          <div className={classes.proficiency}>
            <ProficiencySelect internal={gear.proficiency} onChange={gear.changeProficiency} />
          </div>
        )}
        <ImprovementSelect value={gear.improvement} onChange={gear.changeImprovement} />
      </Flexbox>
    </Flexbox>
  )
}

export default GearControlLabel
