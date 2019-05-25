import React from 'react'
import { IEquipment } from 'kc-calculator'
import clsx from 'clsx'

import { Theme } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Popover from '@material-ui/core/Popover'
import { makeStyles } from '@material-ui/styles'
import BuildIcon from '@material-ui/icons/Build'

import { EquipmentCard, EquipmentLabel, ImprovementSelect, ProficiencySelect, SlotSizePopover } from '../../components'

import { useBaseStyles, useAnchorEl } from '../../hooks'

const useStyles = makeStyles((theme: Theme) => ({
  proficiency: {
    marginRight: 4
  },
  rightButtons: {
    display: 'flex',
    alignItems: 'center',
    margin: `0 4px`
  }
}))

type EquipmentFieldCardProps = {
  equipment: IEquipment
  slotSize?: number
  maxSlotSize?: number
  equipable?: boolean
  onImprovementChange?: (value: number) => void
  onProficiencyChange?: (value: number) => void
  onSlotSizeChange?: (value: number) => void
  onRemove?: () => void
  onUpdate?: () => void
} & React.HTMLAttributes<HTMLDivElement>

const EquipmentFieldCard: React.FC<EquipmentFieldCardProps> = ({
  equipment,
  slotSize,
  maxSlotSize,
  equipable = true,
  onImprovementChange,
  onProficiencyChange,
  onSlotSizeChange,
  onRemove,
  onUpdate,

  className,
  ...paperProps
}) => {
  const { improvement, proficiency, category } = equipment
  const { anchorEl, onClick, onClose } = useAnchorEl()
  const classes = useStyles()
  const baseClasses = useBaseStyles()

  return (
    <Paper className={clsx(baseClasses.flexbox, className)} elevation={1} {...paperProps}>
      <div style={{ width: 16, textAlign: 'right' }}>
        {slotSize === undefined || maxSlotSize === undefined ? (
          <BuildIcon color="action" style={{ fontSize: '0.875rem', verticalAlign: 'middle' }} />
        ) : (
          onSlotSizeChange && <SlotSizePopover value={slotSize} max={maxSlotSize} onChange={onSlotSizeChange} />
        )}
      </div>

      <EquipmentLabel
        className={baseClasses.brightButton}
        flexGrow={1}
        equipment={equipment}
        equipable={equipable}
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
        <EquipmentCard equipment={equipment} onRemove={onRemove} onUpdate={onUpdate} onClose={onClose} />
      </Popover>
    </Paper>
  )
}

export default EquipmentFieldCard
