import React from 'react'
import { IEquipment } from 'kc-calculator'
import clsx from 'clsx'

import { Theme } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Paper, { PaperProps } from '@material-ui/core/Paper'
import Popover from '@material-ui/core/Popover'
import { makeStyles } from '@material-ui/styles'
import BuildIcon from '@material-ui/icons/Build'

import { EquipmentIcon, ImprovementSelect, ProficiencySelect, SlotSizePopover, EquipmentCard } from '../../components'

import { useBaseStyles, useAnchorEl } from '../../hooks'

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    height: 24,
    marginRight: 4
  },
  proficiency: {
    marginRight: 4
  },
  rightButtons: {
    display: 'flex',
    alignItems: 'center',
    margin: `0 4px`
  }
}))

interface EquipmentFieldCardProps extends PaperProps {
  equipment: IEquipment
  slotSize?: number
  equipable?: boolean
  onImprovementChange?: (value: number) => void
  onProficiencyChange?: (value: number) => void
  onSlotSizeChange?: (value: number) => void
  onRemove?: () => void
  onUpdate?: () => void
}

const EquipmentFieldCard: React.FC<EquipmentFieldCardProps> = ({
  equipment,
  slotSize,
  equipable = true,
  onImprovementChange,
  onProficiencyChange,
  onSlotSizeChange,
  onRemove,
  onUpdate,

  className,
  ...paperProps
}) => {
  const { iconId, improvement, proficiency, category } = equipment
  const { anchorEl, onClick, onClose } = useAnchorEl()
  const classes = useStyles()
  const baseClasses = useBaseStyles()
  return (
    <Paper className={clsx(baseClasses.flexbox, className)} elevation={1} {...paperProps}>
      <div style={{ width: 16, textAlign: 'right' }}>
        {slotSize === undefined ? (
          <BuildIcon color="action" style={{ fontSize: '0.875rem', verticalAlign: 'middle' }} />
        ) : (
          onSlotSizeChange && <SlotSizePopover value={slotSize} onChange={onSlotSizeChange} />
        )}
      </div>
      <div onClick={onClick} className={clsx(baseClasses.flexbox, baseClasses.brightButton)} style={{ flexGrow: 1 }}>
        <EquipmentIcon className={classes.icon} iconId={iconId} />
        <Typography style={{ lineHeight: 1, fontSize: '0.75rem' }} color={equipable ? 'initial' : 'secondary'}>
          {equipment.name}
        </Typography>
      </div>

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
        <EquipmentCard equipment={equipment} onRemove={onRemove} onUpdate={onUpdate} onClose={onClose} />
      </Popover>
    </Paper>
  )
}

export default EquipmentFieldCard
