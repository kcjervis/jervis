import React, { useContext } from 'react'
import { IEquipment } from 'kc-calculator'
import classNames from 'classnames'

import { Theme } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Paper, { PaperProps } from '@material-ui/core/Paper'
import Popover from '@material-ui/core/Popover'
import { makeStyles } from '@material-ui/styles'

import { EquipmentIcon, ImprovementSelect, ProficiencySelect, SlotSizePopover, EquipmentCard } from '../../components'

import { useBaseStyles, useAnchorEl } from '../../hooks'

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    height: 24,
    marginRight: theme.spacing(1)
  },
  proficiency: {
    marginRight: theme.spacing(1)
  },
  rightButtons: {
    display: 'flex',
    alignItems: 'center',
    margin: `0 ${theme.spacing(1) * 0.5}px`
  }
}))

interface EquipmentFieldCardProps extends PaperProps {
  equipment: IEquipment
  slotSize?: number
  onImprovementChange?: (value: number) => void
  onProficiencyChange?: (value: number) => void
  onSlotSizeChange?: (value: number) => void
  onRemove?: () => void
  onUpdate?: () => void
}

const EquipmentFieldCard: React.FC<EquipmentFieldCardProps> = ({
  equipment,
  slotSize,
  onImprovementChange,
  onProficiencyChange,
  onSlotSizeChange,
  onRemove,
  onUpdate,

  className,
  ...paperProps
}) => {
  const { masterId, iconId, improvement, proficiency, category } = equipment
  const { anchorEl, onClick, onClose } = useAnchorEl()
  const classes = useStyles()
  const baseClasses = useBaseStyles()
  return (
    <Paper className={classNames(baseClasses.flexbox, className)} elevation={1} {...paperProps}>
      <div
        onClick={onClick}
        className={classNames(baseClasses.flexbox, baseClasses.brightButton)}
        style={{ width: '100%' }}
      >
        <EquipmentIcon className={classes.icon} iconId={iconId} />
        <Typography variant="caption">{equipment.name}</Typography>
      </div>

      <div className={classes.rightButtons}>
        {category.isAerialCombatAircraft && onProficiencyChange && (
          <div className={classes.proficiency}>
            <ProficiencySelect internal={proficiency.internal} onChange={onProficiencyChange} />
          </div>
        )}
        <div>
          {onImprovementChange && <ImprovementSelect value={improvement.value} onChange={onImprovementChange} />}
          {slotSize !== undefined && onSlotSizeChange && (
            <SlotSizePopover value={slotSize} onChange={onSlotSizeChange} />
          )}
        </div>
      </div>

      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}>
        <EquipmentCard equipment={equipment} onRemove={onRemove} onUpdate={onUpdate} onClose={onClose} />
      </Popover>
    </Paper>
  )
}

export default EquipmentFieldCard
