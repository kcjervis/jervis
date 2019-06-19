import React from 'react'
import clsx from 'clsx'
import { IEquipment } from 'kc-calculator'

import Box, { BoxProps } from '@material-ui/core/Box'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import EquipmentIcon from './EquipmentIcon'

const useStyles = makeStyles({
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

type EquipmentLabelProps = {
  equipment: IEquipment
  slotSize?: number
  equipable?: boolean
} & BoxProps

const EquipmentLabel: React.FC<EquipmentLabelProps> = ({ equipment, slotSize, equipable = true, ...boxProps }) => {
  const classes = useStyles()
  const { proficiency, improvement } = equipment
  return (
    <Box display="flex" alignItems="center" {...boxProps}>
      <EquipmentIcon className={classes.icon} iconId={equipment.iconId} />
      <Typography className={classes.name} noWrap color={equipable ? 'initial' : 'secondary'}>
        {equipment.name}
      </Typography>
    </Box>
  )
}

export default EquipmentLabel
